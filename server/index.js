const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require('http');
const db = require('./db/db')
const fs = require("fs");

let app = express();
let server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"],
        credentials: true
    },

});

app.use(express.json());


// Routes
const userRouter = require('./routes/user')
const workspaceRouter = require('./routes/workspace');
const channelRouter = require('./routes/channel');
const reminderRouter = require('./routes/reminder');

let {
    Message,
    SocketClientList,
    SocketAction,
    PrivateMessage
} = require('./types/types');

async function main() {
    //env variables config

    dotenv.config();
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log(`API Listening on ${PORT}`);
    })

    app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "DELETE"],
        credentials: true,
    }))
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // Middleware for routes
    app.use(userRouter);
    app.use(workspaceRouter);
    app.use(channelRouter);
    app.use(reminderRouter);

    let clients = SocketClientList = [];

    io.on('connection', (socket) => {
        let sessionUserId = '';
        let action = SocketAction;

        var current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

        //after getting userid after signing in from user
        // adding the userid to the clients list to identify the socket id
        socket.on('simple-chat-sign-in', (data = {
            userId: '',
            userName: ''
        }) => {
            //keeping te track of session userid to::
            //::remove the user from the client list

            sessionUserId = data.userId;
            clients.push({
                userId: sessionUserId,
                id: socket.id,
                userName: data.userName,
            });
            console.log("clients=", clients)

            db.query(`UPDATE users SET user_last_active ='${date}' WHERE user_id = '${sessionUserId}'`);
        });


        //listen to the subscribing to the workspaces or socket io rooms

        socket.on('subscribe', (workspaceId) => {
            socket.join(workspaceId);

        });


        socket.on('simple-chat-message', async (msg = Message) => {
            //storing message in database;
            const sqlquery = `INSERT INTO messages (channel_id, username, message, date) VALUES 
            ('${msg.channel.split('-')[1]}', '${msg.from}', '${msg.msg}', '${date}')`
            console.log("Message", msg)
            db.query(sqlquery);
            const workspaceId = msg.workspace.split('-')[1];

            //formatting the action for client
            action = {
                type: 'message',
                payload: msg
            }

            console.log("actio-", action)

            // if (action.payload.msgType === "file") {

            //     const buffer = Buffer.from(msg, 'base64');
            //     var file_name = 'user' + msg.from + Date.now() + "image.jpg";

            //     fs.writeFile("./uploads/" + file_name, buffer, {
            //         encoding: 'base64'
            //     }, function (err) {
            //         if (err) {
            //             console.log(err);
            //         } else {

            //             // const b64 = Buffer.from()
            //             action = {
            //                 type: 'message',
            //                 payload: msg
            //             }
            //             console.log("file msg", action)
            //             io.to(workspaceId).emit('update', action);
            //             //console.log("client message", readData)
            //         }
            //     });
            // }

            io.to(workspaceId).emit('simple-chat-message', action);

            // Emit the message to everyone that joined that server

        });

        //private messaging
        socket.on('simple-chat-private-message', async (message = PrivateMessage) => {

            //user id of the person to message

            const from = await db.query(`SELECT user_id from users WHERE username = '${message.from}'`);
            var to = await db.query(`SELECT user_id from users WHERE username = '${message.to}'`);

            db.query(
                `INSERT INTO usermessages (user_from, user_to, message, date) VALUES (
                   '${from[0].user_id}', '${to[0].user_id}', '${message.msg}', '${date}')`
            );

            //finding which socket the action to send to 
            action = {
                type: 'private-message',
                payload: {
                    from: message.from,
                    to: message.to,
                    msg: message.msg,
                    user: message.from.toLowerCase()
                }
            };
            console.log("pm", action)
            // console.log(clients)
            clients.find(client => {
                if (client.userId === to[0].user_id) {
                    io.to(client.id).emit('update', action);
                }
            });


            //finding which socket from
            action = {
                type: 'private-message',
                payload: {
                    from: message.from,
                    to: message.to,
                    msg: message.msg,
                    user: message.to.toLowerCase()
                }
            };
            clients.find(client => {
                if (client.userId === from[0].user_id) {
                    io.to(client.id).emit('update', action);
                }
            });
        });


        // On ping update active status of current user (Client sends every 5 minutes)
        // socket.on('update-active', () => {

        //     db.query(`UPDATE users SET user_last_active = '${date}' WHERE user_id = '${sessionUserId}'`);
        // });

        // On disconnect remove from client list
        socket.on('disconnect', () => {
            clients.find((client, i) => {
                if (client.userId === sessionUserId) {
                    // Emit to all connected users that this user left (disconnects all voice peering calls with him)
                    let action = {
                        type: 'user-leave',
                        payload: {
                            userId: client.userId
                        }
                    };
                    socket.emit('update', action);

                    // Remove from global socket client list
                    clients.splice(i, 1);
                }
            });
            const disconnect = true;

            console.log('user ' + ' disconnected');
        });
    });
}


main();