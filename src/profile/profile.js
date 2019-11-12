import React from 'react';

import SideBar from '../side-bar/sidebar';
import Header from '../header/header';
import './profile.css';
import image from '../../src/profile.jpeg'

class Profile extends React.Component{
    render(){
        return(
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>  
                <div className="container">
                    <div className="card">
                        <img src= {image} alt="Subhro"/>
                        <h1>Subhro Chatterjee</h1>
                        <p className="title">Acquire | Software Developer</p>
                        <p>SRM University</p>
                        <div>
                            <a href="#"><i className="fa fa-dribbble"></i></a> 
                            <a href="#"><i className="fa fa-twitter"></i></a>  
                            <a href="#"><i className="fa fa-linkedin"></i></a>  
                            <a href="#"><i className="fa fa-facebook"></i></a> 
                        </div>
                        <p><button className="btn btn-dark">Contact</button></p>
                    </div>
                </div>              
            </div>
        );
    }
}
export default Profile;
