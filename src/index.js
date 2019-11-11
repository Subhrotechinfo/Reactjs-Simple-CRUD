import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
// import Login from './login/login'
// import SideBar from './side-bar/sidebar'; 
// import Dashboard from './dashboard/dashboard'
import AppRouter from './app-router';
import 'semantic-ui-css/semantic.min.css'
ReactDOM.render(<AppRouter />, document.getElementById('root'));
// ReactDOM.render(<Appy />, document.getElementById('root'));
// ReactDOM.render(<Dashboard />, document.getElementById('root'));
// ReactDOM.render(<SideBar/>, document.getElementById('root'));
// ReactDOM.render(<Login  />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
