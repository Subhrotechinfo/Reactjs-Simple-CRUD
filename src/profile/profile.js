import React from 'react';

import SideBar from '../side-bar/sidebar';
import Header from '../header/header';

class Profile extends React.Component{
    render(){
        return(
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>                
                <p>Subhro Chatterjee Profile</p>
            </div>
        );
    }
}
export default Profile;