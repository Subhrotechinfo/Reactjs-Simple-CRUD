import React from 'react';
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Header from '../header/header';
import SideBar from '../side-bar/sidebar';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



//position of the modal
const customStyle = {
    content:{
        width:'500px',
        top: '50%',
        left: '50%',
        right:'auto',
        bottom :'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement(document.getElementById('root'));

class Dashboard extends React.Component {
    account_id ='';
    constructor(props){
        console.log('constructor', props)
        super();
        
        this.token = props.authToken;
        this.state = {
            data:[],
            modalIsOpen:false,
            addmodalIsOpen:false,
            page:0,
            activePage:1,
            PER_PAGE:10,
            pageRangeDisplayed:0,
            limit:25,
            value:'',
            mode:'',
        };
        //bindings
        this.handleLog = this.handleLog.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.editTags = this.editTags.bind(this);
        this.addTags = this.addTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.sortData = this.sortData.bind(this);
    }
    sortData(){
        console.log('Sorting');
        console.log('Data sort ', this.state.data);
        var sort  = this.state.data.sort(function(a,b){
            return b - a;
        })
        console.log(sort);
    }
    //Model control for edit
    openModal= (data, obj) => {
        
        if(obj.mode == "edit"){
            console.log('Edit mode');
            this.setState({modalIsOpen: true});
            console.log('Open Modal', data, obj);
            this.setState({
                editValue: data.name,
                userId:data.id
            });
        }else if(obj.mode == "create"){
            console.log('create mode');
            this.setState({addmodalIsOpen: true});
        }else if(obj.mode == 'delete'){
            this.setState({deletemodalIsOpen: true});
            console.log('Delete Mode', data);
            if(data){
                this.setState({tag_id: data.id});
            }
        }

    }
    afterOpenModal(){

    }
    closeModal(){
        console.log('Close Modal called');
        this.setState({modalIsOpen: false});
        this.setState({addmodalIsOpen: false});
        this.setState({deletemodalIsOpen:false});
    }
    notify = (msg) => toast(msg);
    editSubmit(value){
        // console.log('Value changes', event.target.value)
        // console.log('Modal value',value);
    }
    
    editTags (event){
        event.preventDefault();
        console.log('Search value',event.target.searchName.value); 
        console.log('Id--> of current user -->', this.state.userId);
        let editObj = {
            id:this.state.userId,
            name:event.target.searchName.value,
            mode:'edit'
        }
        this.Api(editObj);
    }

    // Modal control for delete
    addTags(event){
        event.preventDefault();
        console.log('Add new tag event -->', event.target.addTag.value);
        let createObj = {
            name:event.target.addTag.value,
            mode:'create'
        }
        this.Api(createObj);
    }
    deleteTag(){
        console.log('Delete id --> ', this.state.tag_id);
        let deleteObj = {
            tag_id:this.state.tag_id,
            mode:'delete'
        }
        this.Api(deleteObj);
    }   
    
    Api = (obj) => { 
        let url  = 'https://localhost:2930/api/';
        var authtoken = localStorage.getItem('authToken');
        // Hit API Add/ update
        console.log('About to make api call',obj );
        if(obj.mode && obj.mode == 'create'){
            console.log('Create New Tags API');
            //tag/add
            
            fetch(url+'tag/add',{
                method:'POST',
                headers:{
                    "content-type": "application/json; charset=utf-8",
                    "Authorization":`Bearer ${authtoken}`,
                    "web-lang": "en-US",              
                },
                body:JSON.stringify({account_id:this.account_id, name:obj.name})
                })
                .then((response)=>{
                    return response.json()
                })
                .then((result)=>{
                    console.log('Tag added successfully',result);
                    if(result.success == true ){
                        this.closeModal();
                        this.apiCall();
                        this.notify(result.data)
                    }else if(result.success == false){
                        this.notify(result.error);
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
        }else if(obj.mode && obj.mode == 'edit'){
            console.log('Edit Tags API', obj.id);
            //tag/add
            fetch(url+'tag/add',{
                method:'POST',
                headers:{
                    "content-type": "application/json; charset=utf-8",
                    "Authorization":`Bearer ${authtoken}`,
                    "web-lang": "en-US",              
                },
                body:JSON.stringify({account_id:this.account_id,name:obj.name,tag_id:obj.id})
                })
                .then((response)=>{
                    return response.json()
                })
                .then((result)=>{
                    console.log('Tag added successfully',result);
                    if(result.success == true ){
                        this.closeModal();
                        this.apiCall();
                        this.notify(result.data);
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
        }else if(obj.mode && obj.mode == 'delete'){
            fetch(url+'tag/delete',{
                method:'POST',
                headers:{
                    "content-type": "application/json; charset=utf-8",
                    "Authorization":`Bearer ${authtoken}`,
                    "web-lang": "en-US",              
                },
                body:JSON.stringify({tag_id:obj.tag_id})
                })
                .then((response)=>{
                    return response.json();
                })
                .then((result)=>{
                    console.log('deleted',result)
                    if(result.success == true){
                        this.closeModal();
                        this.apiCall();
                        this.notify(result.data);
                    }else{
                        this.closeModal();
                        this.apiCall();
                        this.notify('something went wrong');
                    }
                })
                .catch((err)=>{
                    console.error(err);
                })
        }
    }

    fetchFunction = () => {

    }

    handlePageChange = data => {
        console.log('Page Change event', );
        let selected = data.selected;
        console.log('Page-->',selected);
        if(selected == 0){
            this.setState({page:selected+1}, () => {
                console.log('About to call Api');
                this.apiCall();
            });
        } 
        else if(selected == 1){
            this.setState({page:selected+1}, () => {
                console.log('About to call Api');
                this.apiCall();
            }); 
        }else{
            this.setState({page:selected+1}, () => {
                console.log('About to call Api');
                this.apiCall();
            });
        }
    }

    apiCall(){
        console.log('Now Search Value -->', this.state.search);
        //make the post request to the api
        let url  = 'https://localhost:2930/api/tag/list';
        var authtoken = localStorage.getItem('authToken');
        if(authtoken){
            fetch(url,{
                method:'POST',
                headers:{
                    "content-type": "application/json; charset=utf-8",
                    "Authorization":`Bearer ${authtoken}`,
                    "web-lang": "en-US",              
                },
                body:JSON.stringify({"limit": this.state.limit , "page": this.state.page, "search":this.state.search})
                })
                .then((response)=>{
                    //response received
                    console.log('Data',response);
                    return response.json()
                })
                .then((result) => {
                    
                    if(result.data.data.length > 0){
                        this.setState({
                            data:result.data.data,
                            length:result.data.data.length,
                            pageCount: Math.ceil(result.data.count/result.data.limit),
                            TOTAL_COUNT:result.data.count, 
                        })  
                        this.account_id =result.data.data[0].account_id 
                    }
                    console.log('Account id',this.account_id);
                })
                .catch((err)=>{
                    console.error(err);
                })
        }else{
            //redirect to dashboard
            this.props.history.push('/');
        }
    }

    componentWillMount(){
        console.log('Component Will Mount -->');
        this.apiCall();
    }
    handleLog(event){
        console.log(event.target.value);
        this.setState({search: event.target.value}, ()=>{
            this.apiCall()
        });
    }
    render(){
        return (
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>
                <div className="container">
                <ToastContainer />
                    <div>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-xs-12 col-sm-4 col-md-4">
                                    <h4>Tags</h4>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 text-right">
                                    <button className="ui primary button" onClick={()=>{
                                        this.openModal(null, {mode:"create"})
                                    }}>Add New Tag</button>
                                </div>
                                <div className="col-md-12">
                                    <p>Tags allow your users to define what the conversation was about. For example, an user can ‘tag’ a conversation as ‘support’ - meaning the customer required support</p>
                                </div>
                                <div className="col-md-12">
                                    {/* <form> */}
                                        <div className="ui search">
                                            <div className="ui icon input">
                                                <input className="prompt"  type="text" placeholder="Search by tag name" onKeyUp={this.handleLog}/>
                                                <i className="search icon"></i>
                                            </div>
                                        </div>
                                    {/* </form> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="ui celled table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name <a onClick={this.sortData}>&#8595;&#8593;</a></th>
                                    <th>Action</th>
                                </tr>
                            </thead>        
                            <tbody>
                            {
                                this.state.data.map((user,i) => {
                                    return <tr key={i}>
                                                <td><div className="ui ribbon label">{user.id}</div></td>
                                                <td id={this.props.id}>{user.name}</td>
                                                <td>
                                                    <a onClick =  {() => {
                                                        // console.log(user.id)
                                                        // this.setState({userId:user.id})
                                                        this.openModal(user, {mode:"edit"});
                                                    }} className="editIcon"><i className="fa fa-edit"></i></a>

                                                    {/* <a onClick={this.editEvent} className="editIcon"><i className="fa fa-edit"></i></a> */}
                                                    <a onClick ={()=>{
                                                        this.openModal(user, {mode:"delete"})
                                                    }}  className="deleteIcon"><i className="fa fa-trash"></i></a>
                                                </td>
                                            </tr>
                                })
                            }          
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination col-sm-12">
                            <div className="col-sm-4">
                                <span>{this.state.TOTAL_COUNT > 0 ? 'Tags '+ this.state.length+' out of '+this.state.TOTAL_COUNT : 'Tags '+ 0 }</span>
                            </div>
                            <div className="col-sm-8 text-center">
                                <ReactPaginate
                                    previousLabel={'previous'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageChange}
                                    containerClassName={'pagination'}
                                    // subContainerClassName={'pages pagination'}
                                    // activeClassName={'active'}
                                />
                            </div>
                    </div>
                </div>
                
                {/* Modal Box For Edit*/}
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen = {this.afterOpenModal}
                    onRequestClose = {this.closeModal}
                    style={customStyle}
                    contentLabel = "EditModalBox"
                >
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">Edit Tags</h4>
                        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                    </div>
                    {/* Modal Body */}
                    <div>
                        <form onSubmit={this.editTags}>
                        <div className="modal-body">
                            <input type="text" name="searchName" value={this.state.editValue} onChange=
                                { e => 
                                    {   e.preventDefault();
                                        console.log(e.target.value)
                                        this.setState({editValue: e.target.value })
                                        // this.editSubmit(e.target.value) 
                                    }
                                } className="form-control"/>
                        </div>
                            <button type="submit" className="btn btn-success">Update</button>
                        </form>
                    </div>
                    {/* Modal Footer */}
                    <div className="Modal-footer">
                        {/* <button type="submit" className="btn btn-success">Save</button>&nbsp;&nbsp; */}
                        <button type="button" className="btn btn-danger" onClick={this.closeModal}>Close</button>
                    </div>
                </Modal>

                {/* Add Modal Box */}
                <Modal
                    isOpen={this.state.addmodalIsOpen}
                    onAfterOpen = {this.afterOpenModal}
                    onRequestClose = {this.closeModal}
                    style={customStyle}
                    contentLabel = "AddModalBox"
                >
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">Add Tags</h4>
                        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                    </div>
                    {/* Modal Body */}
                    <div>
                        <form onSubmit={this.addTags}>
                            <div className="modal-body">
                                <input type="text" name="addTag" className="form-control"/>
                            </div>
                            <button type="submit" className="btn btn-success">Add</button>&nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.closeModal}>Cancel</button>
                        </form>
                    </div>
                </Modal>

                {/* Delete Modal Box */}
                <Modal 
                    isOpen={this.state.deletemodalIsOpen}
                    onAfterOpen = {this.afterOpenModal}
                    onRequestClose = {this.closeModal}
                    style={customStyle}
                    contentLabel = "AddModalBox"
                    >
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">Delete Tags</h4>
                        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                    </div>
                    <div>
                        <div className="modal-body">
                                <p>Are you sure you want to delete ?</p>
                                <button type="button" onClick={this.deleteTag} className="btn btn-success">Sure</button>&nbsp;
                                <button type="button" className="btn btn-danger" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>

                </Modal>
            </div>
        );
    }
}

export default Dashboard;


