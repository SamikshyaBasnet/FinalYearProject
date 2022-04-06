import io, {
    Socket
} from 'socket.io-client';
import {
    ACTION,
} from '../actions/types';


export const socketMiddleWare = (baseUrl) => {
    return (storeAPI) => {

        let socket = io(baseUrl);
        let listener = socket.emit;

        //check action and emit from socket in calling
        // return storeAPI => next => (action = ACTION) => {
        return (next) => (action = ACTION) => {
            //send messgaes over socket
            if (action.type === ACTION.SEND_SOCKET_MESSAGE) {
                socket.emit('simple-chat-message', action.payload);

            }

            //send private messages
            if (action.type === ACTION.SEND_SOCKET_PRIVATE_MESSAGE) {
                socket.emit('simple-chat-private-message', action.payload);

            }

            //call sign in action to send the socket workspace our userid to indentify individual socekt connections
            if (action.type === ACTION.SIGN_IN) {
                socket.emit('simple-chat-sign-in', action.payload);
                console.log("signin payload", action.payload);
                listener = setupSocketListener(socket, storeAPI);
            }

            // Pull workspace list off initial data load
            // Use to "join" our workspace "rooms"
            if (action.type === ACTION.GET_INITIAL_DATA) {
                // Get list of workspace Ids (used for "room" names on socket workspace)
                let workspaces = Object.keys(action.payload.workspaces);
                let workspaceIds = [];

                workspaces.forEach((workspace, i) => {
                    workspaceIds[i] = workspace.split('-')[1];
                });

                // Subscribe to each workspace (Creates a room on socket io)
                workspaceIds.forEach(workspaceId => {
                    socket.emit('subscribe', workspaceId);
                });
            }

            // If user creates a workspace we need to join that room
            if (action.type === ACTION.CREATE_WORKSPACE) {
                let workspaceId = action.payload.workspace.split('-')[1];
                socket.emit('subscribe', workspaceId);
            }

            // Updates our active state on server
            if (action.type === ACTION.UPDATE_ACTIVE_STATE) {
                socket.emit('update-active');
            }
            // socket.removeAllListeners();
            return next(action)
        };

    };
};

// Listens on socket with our userId
// Listens to socket workspace for specific events for messages / private messages
// TODO listen for listen for types of workspace + payload of message
function setupSocketListener(socket = Socket, storeAPI) {
    return socket.on('update', (action) => {
        console.log("action=", action);

        // Check for action type
        if (action.type === 'message') {
            storeAPI.dispatch({
                type: ACTION.RECIEVE_SOCKET_MESSAGE,
                payload: action.payload
            });
            //  socket.removeAllListeners();
        } else if (action.type === 'private-message') {
            storeAPI.dispatch({
                type: ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE,
                payload: action.payload
            });

            // socket.removeAllListeners();
        }
        // if (action.type === 'private-message') 

    });
}