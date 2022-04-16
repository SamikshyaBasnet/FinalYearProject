import {
    ACTION,

} from '../actions/types';


export let ChatStore = {
    workspaces: {
        '': {
            channels: {
                '': {
                    id: '',
                    from: '',
                    msg: '',
                    date: Date,
                },
            },
        },
    },
    privateMessages: {
        '': {
            from: '',
            to: '',
            msg: '',
            date: Date
        },
    },
    activeWorkspace: '',
    activeChannel: '',
    allUserList: {
        user_name: '',
    },
    activeUserList: {
        user_name: '',
    },
    activeView: '',
    activePMUser: '',
    searchedMessages: [{
        id: '',
        username: '',
        msg: '',
        date: Date,
    }],
    pinnedMessages: [{
        id: '',
        username: '',
        msg: '',
        date: Date,
    }],

}

let initialState = {
    workspaces: {
        'Default-FANfDprXmt': {
            channels: {
                'general-0m5vBsRnfd': []
            }
        }
    },
    privateMessages: {},
    activeWorkspace: 'Default-FANfDprXmt',
    activeChannel: 'general-0m5vBsRnfd',
    activeUserList: [],
    allUserList: [],
    activeView: 'workspaces',
    activePMUser: 'none',
    searchedMessages: [],
    pinnedMessages: [],

};
let state;
ChatStore = state;
export const chatReducer = (state = initialState, action) => {
    switch (action.type) {

        case ACTION.RECIEVE_SOCKET_MESSAGE:
            let {
                workspace, channel, from, msg, date
            } = action.payload;

            return {
                ...state,
                workspaces: {
                    ...state.workspaces,
                    [workspace]: {
                        ...state.workspaces[workspace],
                        channels: {
                            ...state.workspaces[workspace].channels,
                            [channel]: [...state.workspaces[workspace]['channels'][channel], {
                                from: from,
                                msg: msg,
                                date: date
                            }]
                        }
                    }
                }
            };
        case ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE:
            if (state.privateMessages[action.payload.user]) {
                return {
                    ...state,
                    privateMessages: {
                        ...state.privateMessages,
                        [action.payload.user]: [
                            ...state.privateMessages[action.payload.user],
                            {
                                from: action.payload.from,
                                to: action.payload.to,
                                msg: action.payload.msg,
                                date: action.payload.date
                            }
                        ]
                    }
                };
            } else
                return {
                    ...state,
                    privateMessages: {
                        ...state.privateMessages,
                        [action.payload.user]: [{
                            from: action.payload.from,
                            to: action.payload.to,
                            msg: action.payload.msg,
                            date: action.payload.date
                        }]
                    }
                };

        case ACTION.CREATE_CHANNEL:
            return {
                ...state,
                workspaces: {
                    ...state.workspaces,
                    [action.payload.workspace]: {
                        ...state.workspaces[action.payload.workspace],
                        channels: {
                            ...state.workspaces[action.payload.workspace].channels,
                            [action.payload.channel]: []
                        }
                    }
                }
            };
        case ACTION.CREATE_WORKSPACE:
            return {
                ...state,
                workspaces: {
                    ...state.workspaces,
                    [action.payload.workspace]: {
                        channels: {
                            [action.payload.channel]: []
                        }
                    }
                }
            };


        case ACTION.GET_INITIAL_DATA:
            return {
                ...state,
                workspaces: action.payload.workspaces,
                    privateMessages: action.payload.privateMessages,
                    activeWorkspace: Object.keys(action.payload.workspaces)[0],
                    activeChannel: Object.keys(action.payload.workspaces[Object.keys(action.payload.workspaces)[0]].channels)[0]

            };
        case ACTION.CHANGE_WORKSPACE:
            return {
                ...state,
                activeWorkspace: action.payload,
                    activeChannel: Object.keys(state.workspaces[action.payload].channels)[0]

            };
        case ACTION.CHANGE_CHANNEL:
            return {
                ...state,
                activeChannel: action.payload
            };
        case ACTION.CHANGE_VIEW:
            return {
                ...state,
                activeView: action.payload,
            };
        case ACTION.GET_ALL_USERS:
            return {
                ...state,
                allUserList: action.payload
            };
        case ACTION.GET_PINNED_MESSAGES:
            return {
                ...state,
                pinnedMessages: action.payload
            };
        case ACTION.GET_SEARCHED_MESSAGES:
            return {
                ...state,
                searchedMessages: action.payload
            };

        case ACTION.GET_SEARCHED_PRIVATE_MESSAGES:
            return {
                ...state,
                searchedMessages: action.payload
            };
        case ACTION.UPDATE_ACTIVE_USERS:
            return {
                ...state,
                activeUserList: action.payload
            };
        case ACTION.CHANGE_PM_USER:
            return {
                ...state,
                activePMUser: action.payload
            };

        default:
            return {
                ...state
            };
    }
};