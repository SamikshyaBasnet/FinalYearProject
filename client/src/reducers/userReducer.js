import {
    ACTION,
} from '../actions/types';

const initialState = {
    userId: '',
    userName: '',
    isSignedIn: false,
    isAdmin: false,
    email: '',

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
            };
        case ACTION.ISUSER_AUTHENICATED:
            return {
                ...state,
                isSignedIn: true,
                    userId: action.payload.userId,

            };
        case ACTION.SIGN_OUT:
            return {
                ...state,
                isSignedIn: false,
                    isAdmin: false,
                    userId: '',
                    userName: '',
                    email: '',
            };
        default:
            return state;
    }
};