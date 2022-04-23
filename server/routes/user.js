const express = require('express')
const db = require('../db/db');
const utilsFunction = require('../utils/utils');

const bcrypt = require("bcrypt");
const saltRounds = 10
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var randtoken = require('rand-token');

const multer = require('multer');
let router = express.Router();


//update pp

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, '../client/public/uploads/')
        //  console.log("file = ", file);
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)

    },
})

const upload = multer({
    storage: storage
});

router.post('/uploadprofile', upload.single('image'), function (req, res) {


    var imgsrc = req.query.fileName;
    var userId = req.query.userId;
    console.log("file name=", imgsrc);
    var insertData = `UPDATE users SET profile='${imgsrc}' WHERE user_id='${userId}'`

    db.query(insertData, (err, result) => {
        if (err) {
            console.log('error', err)
        }

        res.send(imgsrc)
    })

});

router.get('/user/user-data', async (req, res) => {
    const userId = req.query.userId;

    db.query(`SELECT username, email, profile, user_id FROM users
    WHERE user_id='${userId}'`, (err, result) => {
        if (err) {
            res.status(400).send('Server error');
            console.log("error occured", err);

        } else {

            res.json({
                userId: userId,
                userName: result[0].username,
                profile: result[0].profile,
                email: result[0].email,
            });

        }
    });

})

//send email -- email verification
function sendEmail(email, token) {
    try {
        var email = email;
        var token = token;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "localhost",
            requireTLS: true,
            port: 587,
            secure: false,
            auth: {
                user: 'slackappnoreply@gmail.com',
                pass: 'slackapp12@',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        var mailOptions = {
            from: "slackappnoreply@gmail.com",
            to: email,
            subject: 'Email verification - Slack.com',
            html: `<h3>Hello from Slack App!</h3> </br><p>Copy and paste following token in the field: </p></br><h4>Token: ${token}</h4> </br>
            <p>Kindly use this <a href="http://localhost:3000/verify-email?token=${token}">link</a>&nbsp;to verify your email address.</p>`

        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return 1
            } else {
                return 0
            }
        });
    } catch (error) {
        console.log("email not sent ", error);
    }

}

//send email -- forgot password

function sendResetPasswordEmail(email, token) {
    try {
        var email = email;
        var token = token;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "localhost",
            requireTLS: true,
            port: 587,
            secure: false,
            auth: {
                user: 'slackappnoreply@gmail.com',
                pass: 'slackapp12@',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        var mailOptions = {
            from: "slackappnoreply@gmail.com",
            to: email,
            subject: 'Reset Password - Slack.com',
            html: `<h3>Hello from Slack App!</h3> </br><p>Copy and paste following token in the field: </p></br><h4>Token: ${token}</h4> </br>
            <p>Kindly use this <a href="http://localhost:3000/reset-password?token=${token}">link</a>&nbsp;to reset your password.</p>`

        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return 1
            } else {
                return 0
            }
        });
    } catch (error) {
        console.log("email not sent ", error);
    }

}

//search message

router.post('/usermessages/searchprivatemessage', (req, res) => {

    const message = req.query.message;
    db.query(`SELECT u.username, m.id, m.message, m.date from usermessages m
    JOIN users u ON u.user_id = m.user_from
    WHERE m.message='${message}'`,
        (err, result) => {
            if (err) {
                throw err
            } else {
                console.log("searcg", result);
                res.send(result);
            }
        }
    )
});

// Route to get data associated with a specific user
// Expects -> userId
router.get('/user/data', async (req, res) => {
    const userId = req.query.userId;
    const data = {};
    // Query to get all of the workspaces + channels + data
    await db.query(
        `SELECT workspaces.workspace_id, workspaces.workspace_name, channels.channel_id, 
        channels.channel_name, messages.message_id, messages.username, messages.message, messages.type, messages.date
        FROM messages
        right JOIN channels ON messages.channel_id = channels.channel_id
        JOIN workspaces ON workspaces.workspace_id = channels.workspace_id
        JOIN userworkspaces ON workspaces.workspace_id = userworkspaces.workspace_id
        JOIN users ON userworkspaces.user_id = users.user_id
        WHERE users.user_id = '${userId}'`,
        (err, result) => {
            if (err) {
                res.status(400).send('Server error');
                console.log("error occured", err);
                throw err;
            } else {
                result.forEach((datas) => {
                    // Build servers / channel names with IDs
                    const workspaceName = datas.workspace_name + '-' + datas.workspace_id;
                    const userName = datas.channel_name + '-' + datas.channel_id;

                    if (data['workspaces'] === undefined) data['workspaces'] = {};
                    // console.log("user data ", data.workspaces);

                    if (data['workspaces'][workspaceName] === undefined) data['workspaces'][workspaceName] = {};

                    if (data['workspaces'][workspaceName]['channels'] === undefined) data['workspaces'][workspaceName]['channels'] = {};

                    if (data['workspaces'][workspaceName]['channels'][userName] === undefined)
                        data['workspaces'][workspaceName]['channels'][userName] = [];

                    if (datas.username !== null && datas.message !== null)
                        data['workspaces'][workspaceName]['channels'][userName].push({
                            id: datas.message_id,
                            from: datas.username,
                            msg: datas.message,
                            msgType: datas.type,
                            date: datas.date
                        });

                });
            }

            //Query to get all Private messages for user
            db.query(
                `SELECT b.username as user_from, c.username as user_to, a.message, a.type
                FROM usermessages a
                JOIN users b ON b.user_id = a.user_from 
                JOIN users c ON c.user_id = a.user_to 
                WHERE a.user_from = '${userId}'
                OR a.user_to = '${userId}'`,

                // `SELECT * FROM usermessages JOIN users ON users.user_id = usermessages.user_from
                //  where users.user_id = '${userId}'`,
                async (err, result = []) => {
                    if (err) {
                        res.status(400).send('Server error');
                        throw err;
                    } else {
                        // console.log("pm result", result)
                        let userName = await db.query(`SELECT username from users where user_id = '${userId}'`);

                        result.forEach((privateMessage) => {
                            if (err) {
                                console.log("Err", err)
                            }

                            // Build privateMessages object
                            let user = null;

                            // If messages from me, set user to the TO
                            if (privateMessage.user_from === userName[0].username) user = privateMessage.user_to.toLowerCase();
                            else user = privateMessage.user_from.toLowerCase();

                            if (data['privateMessages'] === undefined) data['privateMessages'] = {};

                            if (data['privateMessages'][user] === undefined) data['privateMessages'][user] = [];

                            data['privateMessages'][user].push({
                                user: user,
                                from: privateMessage.user_from,
                                to: privateMessage.user_to,
                                msg: privateMessage.message,
                                msgType: privateMessage.type,
                                date: privateMessage.date
                            });


                        });
                        // If no private messages return data with empty privateMessages array
                        if (data['privateMessages'] === undefined) data['privateMessages'] = [];

                    }
                    //  
                    //the final data
                    res.json({
                        userId: userId,
                        data: data,
                    });

                }
            );

        })
});


//forgot password
router.post('/user/forgot-password', (req, res) => {

    const email = req.body.email;

    db.query('SELECT * FROM users WHERE email = "' + email + '"',
        (error, result) => {
            if (error) {
                res.status(400).send({
                    error: error
                });
            }

            if (result.length > 0) {

                var token = randtoken.generate(20);
                var sent = sendResetPasswordEmail(email, token);
                if (sent != '0') {
                    db.query(`UPDATE users SET token = '${token}' WHERE email = "${email}"`, function (err, result) {
                        if (err) throw err;
                    })

                    return res.status(200).json({
                        success: true,
                        message: "The link to reset your password has been sent to your email."
                    })
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Something Gone Wrong! Please try again."
                    })
                }
            } else {
                return res.json({
                    success: false,
                    message: "The email is not registered!"
                })
            }
        }

    )
})


//Reset password
router.post(`/user/reset-password`, (req, res) => {
    const password = req.body.password;
    const token = req.body.token;

    db.query('SELECT * FROM users WHERE token ="' + token + '"', function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    res.status(400).json({
                        err: err
                    })
                }

                db.query(`UPDATE users SET password='${hash}' WHERE email="${result[0].email}"`, function (err, result) {
                    if (err) throw err
                    return res.status(200).json({
                        success: true,
                        message: "Password changed successfully!"
                    })
                });

            });

        } else {
            return res.json({
                success: false,
                message: "Invalid link or token. Please try again"
            })

        }
    });
})


//register users
router.post('/user/register', async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const join_date = req.body.join_date;
    const isVerified = req.body.isVerified;
    const verified_date = req.body.verified_date;

    db.query("SELECT * FROM users WHERE email = ?", [email],
        (error, result) => {
            if (error) {
                res.json({
                    message: "Sorry!Error occured on server. Please give us a time."
                });
            }

            if (result.length > 0) {
                return res.json({
                    registered: false,
                    message: "User already exist. Please login!"
                })
            } else {
                const userId = utilsFunction.getUniqueId('user');
                // console.log(userId);
                var token = randtoken.generate(20);
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        res.status(400).json({
                            err: err
                        })
                    }
                    var created_date = "";
                    db.query(`INSERT INTO users (user_id, username, email, password, join_date,  user_last_active, isVerified, verifiedDate, token) VALUES ('${userId}', '${username}', '${email}', '${hash}', '${join_date}', '${created_date}', '${isVerified}', '${verified_date}', '${token}')`,
                        (error, result) => {
                            if (error) {
                                console.log(error);
                                res.json({
                                    registered: false,
                                    message: "Problem occured in database. Please give us some time."
                                })
                            } else {
                                sendEmail(email, token)
                                return res.status(201).json({
                                    registered: true,
                                    userName: username,
                                    userId: userId,
                                    message: "User successfully registered! Please check your email to confirm the registration."
                                })
                            }

                        }
                    )
                })

            }
        })
})

//verify email
router.post('/user/verify-email', (req, res) => {

    const token = req.body.token
    const verified_date = req.body.verified_date

    db.query('SELECT * FROM users WHERE token = "' + token + '"', function (err, result) {
        if (err) throw err;


        if (result.length > 0) {
            if (result[0].isVerified === 0) {
                db.query(`UPDATE users SET isVerified = 1, verifiedDate = '${verified_date}'`, function (err, result) {
                    if (err) throw err;

                })
                return res.status(200).json({
                    verified: true,
                    message: "The email has been verified."
                })
            } else {
                console.log('2');
                return res.status(204).json({
                    verified: true,
                    message: "The email has been already verified."
                })

            }

        } else {
            return res.json({
                verified: false,
                message: "The token is incorrect!"
            })
        }

    });
});

//jwt verification
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send("We need a token, please give it to us next time.")

    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.json({
                    auth: false,
                    message: "U failed to authenticate"
                })
            } else {
                //req.userId = decoded.id;
                //  next();
                return res.json({
                    auth: true,
                    userId: req.userId
                })
            }
        });

    }
}

//user authenticated?
router.get('/user/isUserAuth', verifyJWT, (req, res) => {
    const userId = req.query.userId;
    console.log("userid =", userId)
    db.query(`SELECT * FROM users WHERE userId=${userId}`, (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            const username = result[0].username;
            const userId = result[0].user_id;
            const email = result[0].email;
            res.json({
                auth: true,
                userName: username,
                userId: userId,
                email: email,
                message: "Authenticated!! Congrats!",
            });
        }

    })

})

//login users
router.post("/user/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var current = new Date();
    const user_last_active = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

    db.query("SELECT * FROM users WHERE email = ?", [email],
        (error, result) => {
            if (error) {
                res.status(400).send({
                    error: error
                });
            }

            if (result.length > 0) {
                if (result[0].isVerified === 1) {
                    bcrypt.compare(password, result[0].password, (err, response) => {
                        console.log(response);
                        if (err) {
                            console.log("error", err);
                        }
                        if (response) {
                            const username = result[0].username;
                            const userId = result[0].user_id;
                            const profile = result[0].profile;
                            const email = result[0].email;
                            const token = jwt.sign({
                                userId
                            }, "jwtSecret", {
                                expiresIn: 300,
                            });
                            console.log(user_last_active);
                            // req.session.user = result;
                            const sqlquery = `UPDATE users SET user_last_active='${user_last_active}' WHERE email="${result[0].email}"`;
                            db.query(sqlquery, function (err, result) {
                                if (err) {
                                    console.log(err);
                                }


                                return res.status(200).json({
                                    userId: userId,
                                    message: "User is Active Now.",
                                    auth: true,
                                    token: token,
                                    userName: username,
                                    email: email,
                                    profile: profile,

                                })
                            });


                        } else {
                            //401
                            return res.json({
                                auth: false,
                                message: "Wrong Password. Please double check it."
                            })

                        }
                    })
                } else {
                    return res.json({
                        auth: false,
                        message: "Your account is pending.Please check your email to verify your email address."
                    })

                }

            } else {
                return res.json({
                    auth: false,
                    message: "User doesn't exist. Please register."
                })

            }
        })
})


router.get('/user/logout', async (req, res) => {

    const userId = req.query.userId
    var current = new Date();
    const user_last_active = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

    // console.log("userId", userId);

    db.query(`UPDATE users SET user_last_active='${user_last_active}' WHERE user_id="${userId}"`, (err, result) => {
        if (err) throw err
        res.status(200).json({
            message: "User Logged out!",
            auth: false,
        })
    });
});
console.log("hi");

//editing profile
// Route to rename a channel
// Expects -> User Name
// Expects -> User Id
// Expects -> Userid

router.post('/user/usernameedit', (req, res) => {
    const {
        userName,
        userId
    } = req.query;
    if (!userName) {
        res.json({
            message: "Please enter the user name.",
            renamed: false
        });
    } else {
        // Check if user admin
        db.query(`SELECT * from users WHERE user_id = '${userId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    editUserName(userName, userId);
                    res.status(200).json({
                        message: `Renamed to ${userName} successfully!`,
                        userName: userName,
                        userId: userId,
                        renamed: true
                    });
                } else {
                    res.status(401).josn({
                        message: "Something went wrong!",
                        renamed: false
                    });
                }
            }
        )

    }
});




// rename a channel
const editUserName = (userName, userId) => {

    db.query(
        `UPDATE messages INNER JOIN users 
        ON messages.username = users.username
         SET messages.username = '${userName}'`
    );

    db.query(
        `UPDATE users SET username = '${userName}' WHERE user_id = '${userId}'`
    );




    // db.query(
    //     `UPDATE messages SET username = '${userName}' WHERE user_id = '${userId}'`
    // );
};



module.exports = router;