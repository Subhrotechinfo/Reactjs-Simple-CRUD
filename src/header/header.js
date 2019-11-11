import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link , hashHistory,Route} from 'react-router-dom';
// import AppRouter from '../app-router';
import './header.css';

import {withRouter} from 'react-router'

class Header extends React.Component{
    constructor(props){
        super(props);
    }
    logOut = () => {
        console.log('Logout called');
        let token = localStorage.getItem('authToken');
        if(token){
            localStorage.removeItem('authToken');
            // hashHistory.push('/');
            this.props.history.push('/');
            console.log('-->',this.props)
        }
    }

    render(){
        return (
            <nav className = "navbar navbar-expand-sm bg-dark navbar-dark ml-auto">
                <ul className ="navbar-nav ml-auto">
                    <li className ="nav-item">
                        <Link to="" className ="nav-link">Link 1</Link>
                    </li>
                    <li className ="nav-item">
                        <Link to="/" className ="nav-link">Link 2</Link>
                    </li>
                    <li className ="nav-item">
                        {/* <Link to="/" className ="nav-link">Logout</Link> */}
                        <a className ="nav-link" onClick = {this.logOut}>Logout</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default withRouter(Header);