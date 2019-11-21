import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withRouter} from 'react-router';
import update from 'immutability-helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../side-bar/sidebar';
import Header from '../header/header';

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
        this.saveData = this.saveData.bind(this);
    }

    notify = (msg,type) => {
        // console.log('Type -->',type);
        switch (type) {
            case 'success':
                toast.success(msg);break;
            case 'error':
                toast.error(msg);break;
            case 'warn':
                toast.warn(msg);break;
            case 'info':
                toast.info(msg); break;
            default:
                toast(msg);        
        }
    }

    fetchFunction = (URL,bodyObj) => {
        let url  = 'https://localhost:2930/api/';
        var authtoken = localStorage.getItem('authToken');
        console.log(JSON.stringify(bodyObj));
        return fetch(url+URL,{
            method:'POST',
            headers:{
                "content-type": "application/json; charset=utf-8",
                "Authorization":`Bearer ${authtoken}`,
                "web-lang": "en-US",              
            },
            body:JSON.stringify(bodyObj)
            })
    }
    emailPipingFetch(){
        return this.fetchFunction('account/setting/email-piping',{value:'', mode:'view'})
            .then((response) => {return response.json()})
            .then((result) => {
                // console.log('Result -->',result);
                let arr = result.data[0].value
                let x = []
                arr = JSON.parse(arr);
                // console.log(arr)
                if( arr.value.split(',').length > 0 ){
                    for(let e of arr.value.split(',')){
                        // console.log(e);
                        x.push({value:e});
                    }
                }
                console.log(x)
                this.tempDataArray.data = x;
                this.setState({
                    data:this.tempDataArray.data
                })
                console.log('Temp Array -->',this.tempDataArray);
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
        this.emailPipingFetch();
    }

    action_email(action, index){
        console.log('Action --> ', action);
        if(action == 'add'){
            this.tempDataArray.data.push({value:''})
            console.log(this.tempDataArray.data);
            this.setState({
                data:this.tempDataArray.data
            })
        }
        console.log('Now array', this.tempDataArray.data);
        if(action == 'remove'){
            console.log('Index to be removed',index)
            this.tempDataArray.data.splice(index,1);
            console.log('--> Remove',this.tempDataArray.data);
            this.setState({
                data:this.tempDataArray.data
            })
        }
    }
    //Update Event
    inputValueChange(event, index){
        this.noDuplicate = false;
        // let regex = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
        // regex = new RegExp(regex);
        // if(regex.test(event.target.value)){
        //     this.notify('Valid Email','info')
        //     this.noDuplicate = false;
        // }else{
        //     this.notify('Provide a valid emailId','error');
        //     this.noDuplicate = true;
        // }
        console.log(event.target);
        // this.noDuplicate = true;
        // for(let x =0 ; x< this.tempDataArray.data.length; x++){
        //     if(this.tempDataArray.data[x].value == event.target.value){
        //         this.notify('Duplicate emails are not allowed','error');
        //         this.noDuplicate = true;
        //         this.tempDataArray.data[index] = update(this.tempDataArray.data[index], {value: {$set: event.target.value}});
        //     }
        // }
        // for(let x =0 ; x< this.tempDataArray.data.length; x++){
        //     if(this.tempDataArray.data[x].value != event.target.value) {
        //         this.noDuplicate = false;
        //     }
        // }
        
        this.tempDataArray.data[index] = update(this.tempDataArray.data[index], {value: {$set: event.target.value}});
        this.setState({
            data: this.tempDataArray.data
        })
        // console.log('Last duplicate Value --> ', this.noDuplicate);
    }

    handleChecked = (event) => {
        const target = event.target;
        this.setState({
            isChecked: !this.state.isChecked
        });
    }
    checkDuplicates(array){
        
        for(let x of array){
            this.setArray.push(x.value);   
        }
        return new Set(this.setArray).size != array.length;
    }
    emailValidation(emailIds){
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        regex = new RegExp(regex);
        for(let id of emailIds){
            // console.log('E',id)
            if(regex.match(id.value)){
                return true;
            }else {
                return false;
            }
        }
    }
    saveData(){
        this.activeDisabled = this.state.isChecked;
        this.tempDataArray.status =  this.activeDisabled == true ? 'active': 'disabled';
        this.emailPipeConcat = '';
        console.log('About to save', this.tempDataArray.data);
        // console.log(this.emailValidation(this.tempDataArray.data))
        if(this.checkDuplicates(this.tempDataArray.data)){
            this.notify('Duplicates Exist', 'error')
        }else{
            // this.notify('No Duplicates','info');
            for(let index in this.tempDataArray.data){

                //Email check
                // if(this.emailValidation(this.tempDataArray.data)){
                //     this.notify('Valid emailID ', 'info');
                // }else{
                //     this.notify('Provide valid email','error')
                // }



                if(index < this.tempDataArray.data.length){
                    this.emailPipeConcat += this.tempDataArray.data[index].value;
                    if(index < this.tempDataArray.data.length-1) this.emailPipeConcat +=',';
                }
            }
            let value  = JSON.stringify({'status':this.tempDataArray.status,'value':this.emailPipeConcat});
            //make api call
            this.fetchFunction('account/setting/email-piping', {mode:'add-update',value:value})
            .then((response)=>{return response.json()})
            .then((result)=>{
                if(result.success == true){
                    this.notify(result.data,'success');
                    this.emailPipingFetch();
                }else {
                    //change this msg
                    this.notify(result.error,'error');
                }
            })
            .catch((err)=>{
                console.error(err);
            })
        }
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
                <div className="container col-sm-12">
                    <button className="btn btn-info" onClick={this.saveData}>Save</button>
                </div>
                
            </div>
        );
    }
}
export default withRouter(EmailPiping);


