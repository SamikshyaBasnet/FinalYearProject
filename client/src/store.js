// import {
//     chatReducer,
//     ChatStore
// } from './chatReducer';
// import {
//     userReducer,
//     UserStore
// } from './userReducer';
// import {
//     combineReducers
// } from 'redux';

// export const StoreState = {
//     // chat: ChatStore,
//     user: UserStore,
// }

// export default combineReducers < StoreState > ({
//     chat: chatReducer,
//     user: userReducer
// });


import {
    createStore,
    combineReducers,
    compose,
    applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';

import {
    chatReducer,
    ChatStore
} from './chatReducer';
import {
    userReducer,
} from './Components/reducers/userReducer';
const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
});

const store = () => {
    return createStore(
        rootReducer,
        compose(applyMiddleware(thunk))
    );
};

export default store;