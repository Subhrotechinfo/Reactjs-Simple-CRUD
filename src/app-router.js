import React from 'react';
 
import Login from './login/login';
import Dashboard from './dashboard/dashboard';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Profile from './profile/profile';


const AppRouter = () => {
    return (
        <Router>
            <Route component={Login} path="/" exact></Route>
            <Route component={Dashboard} path="/dashboard" ></Route>
            <Route component={Profile} path="/profile" ></Route>
        </Router>
    );
}

export default AppRouter;






