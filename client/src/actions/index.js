import Axios from '../Components/API/api';
import {
    ACTION
} from './types';



//sign up
export const signUp = (user) => ({
    type: ACTION.SIGN_UP,
    payload: user
});

// On sign in
export const signIn = (user) => ({
    type: ACTION.SIGN_IN,
    payload: user
});

// On sign out
export const signOut = () => ({
    type: ACTION.SIGN_OUT,
    payload: null
});

//is user authenticated?
export const isUserAuth = (user) => ({
    type: ACTION.ISUSER_AUTHENICATED,
    payload: user
})

//create workspace 
export const createWorkspace = (workspace) => ({
    type: ACTION.CREATE_WORKSPACE,
    payload: workspace
});

//get active user list in workspace
export const updateActiveUserList = (workspaceId) => async (dispatch) => {
    const res = await Axios.get(`/workspace/activeusers?workspaceId=${workspaceId}`)
    dispatch({
        type: ACTION.UPDATE_ACTIVE_USERS,
        payload: res.data
    });

};

export const getUsersInWorkspace = (workspaceId) => async (dispatch) => {
    const res = await Axios.get(`/workspace/allusers?workspaceId=${workspaceId}`)
    dispatch({
        type: ACTION.GET_ALL_USERS,
        payload: res.data
    });
};


//create channel 
export const createChannel = (channel) => ({
    type: ACTION.CREATE_CHANNEL,
    payload: channel
});

// Action to change the current Active Server
export const changeWorkspace = (workspace) => (dispatch) => {
    dispatch(updateActiveUserList(workspace.split('-')[1]));
    dispatch(getUsersInWorkspace(workspace.split('-')[1]));
    dispatch({
        type: ACTION.CHANGE_WORKSPACE,
        payload: workspace
    });
};

// Action to change the current Active Channel
export const changeChannel = (channel) => ({
    type: ACTION.CHANGE_CHANNEL,
    payload: channel
});

// Action to change the current active view
export const changeView = (view) => ({
    type: ACTION.CHANGE_VIEW,
    payload: view
});

// Action to change active user we have private message open with
export const changePMUser = (user) => ({
    type: ACTION.CHANGE_PM_USER,
    payload: user
});

//action to get all reminder
export const getReminder = (reminder) => ({
    type: ACTION.GET_REMINDERS,
    payload: reminder
});

//action to get all reminder
export const getPinnedMessages = (message) => ({
    type: ACTION.GET_PINNED_MESSAGES,
    payload: message
});

//action to create reminder
export const createReminder = (reminder) => ({
    type: ACTION.CREATE_REMINDER,
    payload: reminder
});

// Action creator to update active state (socket middleware)
export const updateActiveState = (user) => ({
    type: ACTION.UPDATE_ACTIVE_STATE,
    payload: user
});

export const initialData = (data) => ({
    type: ACTION.GET_INITIAL_DATA,
    payload: data
})

// Loads user Data. Gets all Servers + Channel History
export const loadUserData = (userId) => async (dispatch) => {
    let url = `/user/data?userId=${userId}`;
    const res = await Axios.get(url);
    console.log("fun res", res);

    const workspaceId = Object.keys(res.data.data.workspaces)[0].split('-')[1]
    // get active user list for first server
    dispatch(updateActiveUserList(workspaceId));
    dispatch(getUsersInWorkspace(workspaceId));

    const init = dispatch(initialData(res.data.data));
    console.log("initial data", init);

    const actw = Object.keys(res.data.data.workspaces)[0]
    // console.log("active workspace = ", actw);

    const acch = Object.keys(res.data.data.workspaces[Object.keys(res.data.data.workspaces)[0]].channels)[0]
    //console.log("active channel =", acch)

};

export const loadReminders = (userId) => async (dispatch) => {
    let url = `/reminders?userId=${userId}`;
    const res = await Axios.get(url);
    console.log("all reminders", res);
    const rem = dispatch(getReminder(res.data));
    console.log("remsa ", rem)
}

export const loadPinnedMessages = (channelId) => async (dispatch) => {
    let url = `/channel/pinnedmessage?channelId=${channelId}`;
    const res = await Axios.get(url);
    const rem = dispatch(getPinnedMessages(res.data));
    console.log("pinned Mesages =", rem)

}

export const loadSearchedMessages = (message, channelId) => async (dispatch) => {
    let url = `/channel/searchmessage?channelId=${channelId}&message=${message}`;
    const res = await Axios.get(url);
    const rem = dispatch(getPinnedMessages(res.data));
    console.log("search Mesages =", rem)
}


//SOCEKT ACTIONS

//to send the message
export const sendMessage = (message) => ({
    type: ACTION.SEND_SOCKET_MESSAGE,
    payload: message
});

//to receive the message to channel 
export const receiveMessage = (message) => ({
    type: ACTION.RECIEVE_SOCKET_MESSAGE,
    payload: message
});

//to send the private messages
export const sendPrivateMessage = (message) => ({
    type: ACTION.SEND_SOCKET_PRIVATE_MESSAGE,
    payload: message
});

//to receive the private messages
export const receivePrivateMessage = (message) => ({
    type: ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE,
    payload: message
});

export const addEmoticon = (updatedMessage) => ({

    type: ACTION.ADD_EMOTICON,
    updatedMessage

});