import {
    chatReducer,
    ChatStore,
} from './chatReducer';
import {
    userReducer
} from './userReducer';
import {
    combineReducers
} from 'redux';



export default combineReducers({
    chat: chatReducer,
    user: userReducer
});