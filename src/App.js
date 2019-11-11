import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Appy extends React.Component{
  constructor(props){
    super(props);
    this.state = {value:''};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event){
    alert('The name that is submitted.'+this.state.value);
    event.preventDefault();
  }
  render() {
    return (
      <div className="Appy">
        <header className="Appy-Header">
          <p>Subhro Chatterjee</p>
        </header>
        <body>
          <img src={logo} className="App-logo" alt="logo"/> 
          <div class="col-sm-8 container">
            <form onSubmit = {this.handleSubmit}>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" value={this.state.value}/>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" value={this.state.value}/>
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>          
          </div>
        </body>
      </div>
    );
  }

}
export default Appy;




