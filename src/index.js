import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import {BoundApp} from './App';
import {createStore} from "redux";
import {Provider} from "react-redux";
import {main} from "./features/main";


let store = createStore(
  main,
);

ReactDOM.render(
  <Provider store={store}>
    <BoundApp />
  </Provider>,
  document.getElementById('root'));