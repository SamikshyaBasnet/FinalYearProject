import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Provider
} from "react-redux";
import thunk from 'redux-thunk';
import reducers from './reducers';
import {
  composeWithDevTools
} from 'redux-devtools-extension';
import {
  createStore,
  applyMiddleware
} from 'redux';
import { socketMiddleWare } from './middlewares/socketMiddleware';

// const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_API_URL;


const baseUrl = 'http://localhost:5000/';
const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, socketMiddleWare(baseUrl))));

//store.subscribe(() => saveToLocalStorage(store.getState()));


ReactDOM.render(

  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root')
);