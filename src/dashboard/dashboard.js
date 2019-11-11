import React from 'react';
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Header from '../header/header';
import SideBar from '../side-bar/sidebar';
import Modal from './modal';

import ReactPaginate from 'react-paginate';

class Dashboard extends React.Component {
    constructor(props){
        console.log('constructor', props)
        super();
        this.token = props.authToken;
        this.state = {
            data:[],
            show:false,
            page:0,
            activePage:1,
            PER_PAGE:10,
            pageRangeDisplayed:0,
            limit:25
        };
    }
    //Model control
    showModel = () => {
        this.setState({ show:true })
    }
    hideModel = () => {
        this.setState({ show:false })
    }
    handleSubmit= (event)=> {
        console.log(event.target.value);
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
        }else {
            this.setState({page:selected+1}, () => {
                console.log('About to call Api');
                this.apiCall();
            });
        }
    }

    apiCall(){
        console.log('Now State Value -->', this.state.page);
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
                body:JSON.stringify({"limit": this.state.limit , "page": this.state.page})
                })
                .then((response)=>{
                    //response received
                    console.log('Data',response);
                    return response.json()
                })
                .then((result)=>{
                    console.log('Data Length Rendered --> ', result.data.data.length)
                    console.log('Per', Math.ceil(result.data.count/result.data.limit));
                    this.setState({
                        data:result.data.data,
                        length:result.data.data.length,
                        pageCount: Math.ceil(result.data.count/result.data.limit),
                        TOTAL_COUNT:result.data.count
                    })
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
    editEvent=()=>{
        // e.preventDefault();
        console.log('Edit called')
    }
    deleteEvent(){
        // e.preventDefault();
        console.log('Delete Called');
    }
    render(){
        return (
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>
                <div className="container">
                    <div>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-xs-12 col-sm-4 col-md-4">
                                    <h4>Tags</h4>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 text-right">
                                    <button className="ui primary button">Add New Tag</button>
                                </div>
                                <div className="col-md-12">
                                    <p>Tags allow your users to define what the conversation was about. For example, an user can ‘tag’ a conversation as ‘support’ - meaning the customer required support</p>
                                </div>
                                <div className="col-md-12">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="ui search">
                                            <div className="ui icon input">
                                                <input className="prompt" type="text" placeholder="Search by tag name"/>
                                                <i className="search icon"></i>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="ui celled table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>        
                            <tbody>
                            {
                                this.state.data.map((user,i) => {
                                    return <tr key={i}>
                                                <td><div className="ui ribbon label">{user.id}</div></td>
                                                <td>{user.name}</td>
                                                <td>
                                                    <a onClick = {this.showModel} className="editIcon"><i className="fa fa-edit"></i></a>
                                                    {/* <a onClick={this.editEvent} className="editIcon"><i className="fa fa-edit"></i></a> */}
                                                    <a onClick = {() => this.deleteEvent()} className="deleteIcon"><i className="fa fa-trash"></i></a>
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
                <Modal show={this.state.show} handleClose={this.hideModel}>
                    <p>Modal</p>
                    <p>Data</p>
                </Modal>
            </div>
        );
    }
}

export default Dashboard;


