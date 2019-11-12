import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

export default class SideBar extends React.Component{
    render(){
        return(
            <div>
                <SideNav>
                    <SideNav.Toggle/>
                    <SideNav.Nav defaultSelected="Home">
                        <NavItem eventKey = "dashboard">
                            <NavIcon>
                                <Link to="/">
                                    <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }}></i>
                                </Link>
                            </NavIcon>
                            <NavText>
                                <Link to="/dashboard">
                                    Dashboard
                                </Link>
                            </NavText>
                        </NavItem>
                   
                        <NavItem eventKey = "profile">
                            <NavIcon>
                                <Link to="/profile">
                                    <i className="fa fa-user" style={{ fontSize: '1.75em' }}></i>
                                </Link>
                            </NavIcon>
                            <NavText>
                            <Link to="/profile">
                                Profile
                            </Link>
                            </NavText>
                        </NavItem>        
                     
                        <NavItem eventKey = "analytics">
                            <NavIcon>
                                <i className="fa fa-bar-chart" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                Analytics
                            </NavText>
                        </NavItem>
                     
                        <NavItem eventKey = "trigger">
                            <NavIcon>
                                <i className="fa fa-snowflake-o" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                Trigger
                            </NavText>
                        </NavItem>
                     
                        <NavItem eventKey = "appStore">
                            <NavIcon>
                                <i className="fa fa-th" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                App Store
                            </NavText>
                        </NavItem>
                     
                        <NavItem eventKey = "setting">
                            <NavIcon>
                                <i className="fa fa-cogs" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                Setting
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            </div>
        );
    }
}


