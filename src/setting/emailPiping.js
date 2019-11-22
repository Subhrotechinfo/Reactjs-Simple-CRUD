import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withRouter} from 'react-router';
import update from 'immutability-helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../side-bar/sidebar';
import Header from '../header/header';
import {emailValidator,checkDuplicates} from '../lib/validation';
import {fetch} from '../lib/apiCall';
import {notify} from '../lib/notificaton';

class EmailPiping extends React.Component{
    tempDataArray = {
        status:'active',
        data:[{value:''}]
    };
    activeDisabled='';
    emailPipeConcat= '';
    noDuplicate= false;
    setArray = [];
    constructor(props){
        super(props);
        this.state = {data:[],authToken:'',isChecked:false};
        this.action_email = this.action_email.bind(this);
        this.inputValueChange = this.inputValueChange.bind(this);
        this.saveEmailPipingIds = this.saveEmailPipingIds.bind(this);
    }
    getEmailPipingIds(){
        return fetch('account/setting/email-piping',{value:'', mode:'view'})
            .then((response) => {return response.json()})
            .then((result) => {
                let arr = result.data[0].value
                let x = []
                arr = JSON.parse(arr);
                if( arr.value.split(',').length > 0 ){
                    for(let e of arr.value.split(',')){
                        x.push({value:e});
                    }
                }
                let checkStatus = arr.status == 'active' ? true:false;
                this.tempDataArray.data = x;
                this.setState({
                    data:this.tempDataArray.data,
                    isChecked:checkStatus
                })
            })
            .catch((err) => {
                console.log('Error Catched while View Email Piping');
                console.error(err);
            })
    }
    UNSAFE_componentWillMount(){
        this.state.authToken = localStorage.getItem('authToken');
        if(this.state.authToken){
            this.props.history.push('/emailPiping');
        }else{
            this.props.history.push('/');
        }
        this.getEmailPipingIds();
    }
    action_email(action, index){
        if(action == 'add'){
            this.tempDataArray.data.push({value:''})
            this.setState({
                data:this.tempDataArray.data
            })
        }
        if(action == 'remove'){
            this.tempDataArray.data.splice(index,1);
            this.setState({
                data:this.tempDataArray.data
            })
        }
    }
    //Update Event
    inputValueChange(event, index){
        this.noDuplicate = false;
        this.tempDataArray.data[index] = update(this.tempDataArray.data[index], {value: {$set: event.target.value}});
        this.setState({
            data: this.tempDataArray.data
        })
    }
    handleChecked = (event) => {
        const target = event.target;
        this.setState({
            isChecked: !this.state.isChecked
        });
    }
    saveEmailPipingIds(){
        this.activeDisabled = this.state.isChecked;
        this.tempDataArray.status =  this.activeDisabled == true ? 'active': 'disabled';
        this.emailPipeConcat = '';
        if(checkDuplicates(this.tempDataArray.data)){
            notify('Duplicates Exist', 'error')
        }else{
            //Email check
            if(emailValidator(this.tempDataArray.data)){
                //Emails Concat
                for(let index in this.tempDataArray.data){
                    if(index < this.tempDataArray.data.length){
                        this.emailPipeConcat += this.tempDataArray.data[index].value;
                        if(index < this.tempDataArray.data.length-1) this.emailPipeConcat +=',';
                    }
                }
                let value  = JSON.stringify({'status':this.tempDataArray.status,'value':this.emailPipeConcat});
                //make api call
                fetch('account/setting/email-piping', {mode:'add-update',value:value})
                .then((response)=>{return response.json()})
                .then((result)=>{
                    if(result.success == true){
                        notify(result.data,'success');
                        this.getEmailPipingIds();
                    }else {
                        //change this msg
                        notify(result.error,'error');
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
            }else{
                notify('Provide valid email','error');
            }
        }//End Else
    }
    render(){
        const onOff = this.state.isChecked
        return (
            <div className="container">
                <div className="col-sm-12">
                        <Header/>
                </div>
                <SideBar/>
                <div className="col-sm-12 pt-3">
                        <div className="row">
                            <div className="col-sm-2">
                                <p>Email Piping | {onOff ? 'On':'Off'}</p>
                            </div>
                            <div className="col-sm-2">
                                <div className="ui toggle checkbox">
                                    <input type="checkbox" name="isChecked" value = {this.state.isChecked} checked = {this.state.isChecked}  onChange={this.handleChecked}/>
                                    <label></label>
                                </div>
                            </div>
                            <div className="col-sm-12 pt-2 pb-3">
                                <p>Automatically send the chat transcript to your email after the chat ends.</p>
                            </div>        
                        </div>
                </div>
                <div className="col-sm-12">
                <ToastContainer autoClose={3000}/>

                {
                    this.state.data.map((item, index)=>{
                         return <div className="row" key={index}>
                                    <div className="col-sm-4" >
                                        <div className="form-group" >
                                            <input type="email" className="form-control" value= {item.value}  name={'pipe_email - '+index} onChange={
                                                (event) => {
                                                    this.inputValueChange(event,index)
                                                }}/>
                                        </div>
                                    </div>
                                    {
                                        index == 0 &&   <div className="col-sm-1">
                                                            <div className="form-group">
                                                                <button className="btn btn-success" onClick={
                                                                    ()=>{
                                                                        this.action_email('add', index)
                                                                    }}>+</button>
                                                            </div>
                                                        </div>
                                    }
                                    {
                                        index > 0 &&    <div className="col-sm-1">
                                                            <div className="form-group">
                                                                <button className="btn btn-danger" onClick={
                                                                    ()=>{
                                                                        this.action_email('remove', index)
                                                                    }
                                                                    }><i className="fa fa-trash" aria-hidden="true"></i></button>                
                                                            </div>
                                                        </div>
                                    }
                                    
                                    
                                </div>
                    })
                }
                </div>
                {
                    this.state.data.length > 0 &&   <div className="container col-sm-12">
                                                        <button className="btn btn-info" onClick={this.saveEmailPipingIds}>Save</button>
                                                    </div>
                }
                {
                    this.state.data.length == 0 &&  <div>
                                                        <p className="text-muted">No records to display</p>
                                                    </div>
                }
                
                
            </div>
        );
    }
}
export default withRouter(EmailPiping);


