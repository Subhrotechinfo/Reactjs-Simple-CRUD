import React from 'react';
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import * as sha1 from 'js-sha1';

class Login extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentDidMount(){
    //     // console.log('Hello Subhro Chatterjee');   
    // }
    handleChange(){
    }
    componentWillMount(){
        var token = localStorage.getItem('authToken');
        if(token){
            //if token exist redirect to dashboard
            this.props.history.push('/dashboard')
        }else{
            //else back to login
            this.props.history.push('/');
        }

    }

    handleSubmit = (event) => {
        var url = 'https://localhost:2930/api/auth/login';
        // let acc_id =localStorage.getItem('cur_acc_id');
        var data = {
            'username':event.target.email.value,
            'password':sha1(event.target.password.value),
            'cur_acc_id':17
        };
        event.preventDefault();
        // console.log('Email',event.target.email.value);
        // console.log('Password',sha1(event.target.password.value));
        fetch(url,{
            method:'POST',
            headers:{
                "content-type": "application/json; charset=utf-8",
                    "X-Request-API": "App",
                    "web-lang": "en-US",
                    "web-timezone": "+05:30",
            },
            body:JSON.stringify(data)
        })
        .then((response) => {
            console.log(response);
            if(response.status === 200){
                let authToken =response.headers.get('auth-token');
                localStorage.setItem('authToken', authToken);
                console.log('Auth Token', authToken);
            }
            return response.json();
        })
        .then((result) => {
            // console.log('Got response');
            // console.log('Result -->',result);
            if(result.data === true){
                //redirect to dashboard
                this.props.history.push("/dashboard");
            }
        })
        .catch((err)=>{
            console.log('Catched Error');
            console.error(err);
        });
    }

    render(){
        return (
            <div className="container col-md-6">
                {/* <Header/> */}
                {/* <Dashboard/> */}
                {/* <SideBar/> */}
                <p>Token Value : {this.state.value.authToken}</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label id="email">Email Id</label>
                        <input type="email" name="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label id="password">Password</label>
                        <input type="password" name="password" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-success">Save</button>
                </form>
            </div>                
        )
    }
}



export default Login;
