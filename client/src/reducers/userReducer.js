import {
    ACTION,
} from '../actions/types';

const initialState = {
    userId: '',
    userName: '',
    isSignedIn: false,
    isAdmin: false,
    email: '',
    isActive: false,
    profile: '',
    reminders: [{
        reminderId: '',
        name: '',
        body: '',
        date: Date,
    }],

};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION.SIGN_UP:
            return {
                ...state,
                isSignedIn: false,
                    userId: action.payload.userId,
                    userName: action.payload.userName,
                    email: action.payload.email,
            };

        case ACTION.SIGN_IN:
            return {
                ...state,
                isSignedIn: true,
                    userId: action.payload.userId,
                    userName: action.payload.userName,
                    isAdmin: action.payload.isAdmin,
                    email: action.payload.email,
                    isActive: true,
                    profile: action.payload.profile,

            };
        case ACTION.UPLOAD_PROFILE:
            return {
                ...state,
                profile: action.payload,
            };
        case ACTION.ISUSER_AUTHENICATED:
            return {
                ...state,
                isSignedIn: true,

            };
        case ACTION.SIGN_OUT:
            return {
                ...state,
                isSignedIn: false,
                    isAdmin: false,
                    userId: '',
                    userName: '',
                    email: '',
                    isActive: false,
            };

        case ACTION.GET_REMINDERS:
            return {
                ...state,
                reminders: action.payload
            };
        case ACTION.SIGN_IN:
            return {
                ...state,
                isSignedIn: true,
                    userId: action.payload.userId,
                    userName: action.payload.userName,
                    isAdmin: action.payload.isAdmin,
                    email: action.payload.email,
                    isActive: true,
                    profile: action.payload.profile,

            };
        case ACTION.GET_USER_DATA:
            return {
                ...state,
                userId: action.payload.userId,
                    userName: action.payload.userName,
                    isAdmin: action.payload.isAdmin,
                    email: action.payload.email,
                    isActive: true,
                    profile: action.payload.profile,

            };
        case ACTION.CREATE_REMINDER:
            return {
                ...state,
                reminders: action.payload
            };

        default:
            return state;
    }
};