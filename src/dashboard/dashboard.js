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

import {fetch} from '../lib/apiCall';
import {notify} from '../lib/notificaton';

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
            page:1,
            activePage:1,
            PER_PAGE:10,
            pageRangeDisplayed:0,
            limit:'10',
            value:'',
            mode:'',
        };
        //bindings
        this.handleLog = this.handleLog.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.editTags = this.editTags.bind(this);
        this.addTags = this.addTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.sortData = this.sortData.bind(this);
        // toast.configure({
        //     autoClose: 2000
        // })
    }
    
    //sorting Data
    sortData(){
        var comparator = (prop) => (a,b) =>  a[prop] === b[prop] ? 0 : a[prop] < b[prop] ? -1:1;
        this.setState({
            data:this.state.data.sort(comparator('name'))
        });
    }

    //Model control for edit
    openModal= (data, obj) => {
        if(obj.mode === "edit"){
            // console.log('Edit mode');
            this.setState({modalIsOpen: true});
            this.setState({
                editValue: data.name,
                userId:data.id
            });
        }else if(obj.mode === "create"){
            // console.log('create mode');
            this.setState({addmodalIsOpen: true});
        }else if(obj.mode === 'delete'){
            this.setState({deletemodalIsOpen: true});
            // console.log('Delete Mode', data);
            if(data){
                this.setState({tag_id: data.id});
            }
        }
    }
    closeModal(){
        this.setState({modalIsOpen: false});
        this.setState({addmodalIsOpen: false});
        this.setState({deletemodalIsOpen:false});
    }

    editSubmit(){
        // this.closeModal()
    }

    editTags (event){
        event.preventDefault();
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
        let createObj = {
            name:event.target.addTag.value,
            mode:'create'
        }
        this.Api(createObj);
    }
    deleteTag(){
        let deleteObj = {
            tag_id:this.state.tag_id,
            mode:'delete'
        }
        this.Api(deleteObj);
    }
    
    Api = (obj) => {
        if(obj.mode && obj.mode === 'create'){
            fetch('tag/add',{account_id:this.account_id, name:obj.name})
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if(result.success == true ){
                        this.closeModal();
                        this.getTagsDetails();
                        notify(result.data, 'success');
                    }else if(result.success == false){
                        notify(result.error, 'error');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    notify('Something went wrong','error');
                })
        }else if(obj.mode && obj.mode == 'edit'){
            fetch('tag/add',{name:obj.name,tag_id:obj.id})
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if(result.success == true ){
                        this.closeModal();
                        this.getTagsDetails();
                        notify(result.data,'success');
                    }
                    else if(result.success == false ){
                        notify(result.error, 'error');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    notify('Something went wrong','error');
                })
        }else if(obj.mode && obj.mode == 'delete'){
             fetch('tag/delete',{tag_id:obj.tag_id})
                .then((response)=>{
                    return response.json();
                })
                .then((result)=>{
                    if(result.success == true){
                        this.closeModal();
                        this.getTagsDetails();
                        notify(result.data, 'success');
                    }else{
                        this.closeModal();
                        this.getTagsDetails();
                        notify('something went wrong','error');
                    }
                })
                .catch((err)=>{
                    console.error(err);
                    notify('Something went wrong','error');
                })
        }
    }
    handlePageChange = data => {
        let selected = data.selected;
        if(selected == 0){
            this.setState({page:selected+1}, () => {
                this.getTagsDetails();
            });
        }
        else{
            this.setState({page:selected+1}, () => {
                this.getTagsDetails();
            });
        }
    }

    getTagsDetails(){
        //make the post request to the api
        var authtoken = localStorage.getItem('authToken');
        if(authtoken){
            fetch('tag/list',{"limit": this.state.limit,"page": this.state.page,"search":this.state.search})
                .then((response)=>{
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
                    }else if(result.data.data.length == 0){
                        this.setState({
                            data:result.data.data,
                            length:result.data.data.length,
                            pageCount: Math.ceil(result.data.count/result.data.limit),
                            TOTAL_COUNT:result.data.count, 
                        })
                    }
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
        this.getTagsDetails();
    }
    handleLog(event){
        this.setState({search: event.target.value, page:1}, ()=>{
            this.getTagsDetails()
        });
    }
    render(){
        let deleteModal =
        <Modal 
        isOpen={this.state.deletemodalIsOpen}
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
                            <button type="button" onClick={this.deleteTag} className="btn btn-info">Sure</button>&nbsp;
                            <button type="button" className="btn btn-light" onClick={this.closeModal}>Cancel</button>
                    </div>
                </div>
        </Modal>;
        let addModal = 
            <Modal
            isOpen={this.state.addmodalIsOpen}
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
                            <input type="text" name="addTag" className="form-control" required/>
                        </div>
                        <button type="submit" className="btn btn-info">Save</button>&nbsp;
                        <button type="button" className="btn btn-light" onClick={this.closeModal}>Cancel</button>
                    </form>
                </div>
            </Modal>;
        let editModal = 
            <Modal
                isOpen={this.state.modalIsOpen}
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
                                                this.setState({editValue: e.target.value }) 
                                            }
                                        } className="form-control"/>
                                </div>
                                {/* Modal Footer */}
                                <div className="Modal-footer">
                                    <button type="submit" className="btn btn-info">Update</button>&nbsp;
                                    <button type="button" className="btn btn-light" onClick={this.closeModal}>Close</button>
                                </div>
                            </form>
                        </div>
            </Modal>;
        return(
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>
                <div className="container">
                <ToastContainer autoClose={3000}/>
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
                                <div className="col-md-12 search-box">
                                        <div className="ui search">
                                            <div className="ui icon input">
                                                <input className="prompt"  type="text" placeholder="Search by tag name ^-^" onKeyUp={this.handleLog}/>
                                                <i className="search icon"></i>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="ui celled table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name <a className= "tagHeader" onClick={this.sortData}>&#8595;&#8593;</a></th>
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
                    <div className="col-sm-12">
                            <div className="container">
                                <div className="row footerContainer">
                                    <div className="col-sm-1 text-right padding">Show</div>
                                    <div className="col-sm-1"> 
                                            <select className="form-control" value={this.state.limit} onChange=
                                                                        {
                                                                            (event) => {
                                                                                event.persist();
                                                                                // console.log('select value event',event.target.value);
                                                                                this.setState({limit:event.target.value,page:1}, ()=>{
                                                                                    this.getTagsDetails();
                                                                                });
                                                                            }
                                                                        }
                                                >
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                            </select>
                                    </div>
                                    <div className="col-sm-1 text-left padding">entries</div>
                                    <div className="col-sm-2 padding ">
                                        <span className="text-muted bgColor">{this.state.TOTAL_COUNT > 0 ? 'Tags '+ this.state.length+' out of '+this.state.TOTAL_COUNT : 'Tags '+ 0 }</span>
                                    </div>
                                    <div className="col-sm-7 padding rghtPadding">
                                    { this.state.data.length > 0 && this.state.pageCount > 1 &&
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
                                            // previousClassName={'react-paginate'}
                                            subContainerClassName={'pages pagination'}
                                            activeClassName={'active'}
                                            pageClassName={'reactUI'}
                                        />
                                    }
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>

                {/* Modal Box For Edit*/}
                {editModal}

                {/* Add Modal Box */}
                {addModal}
                
                {/* Delete Modal Box */}
                {deleteModal}
            </div>
        );
    }
}
export default Dashboard;


