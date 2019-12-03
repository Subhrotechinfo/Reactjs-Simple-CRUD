import React from 'react';
// import * as cnty from 'countries-and-timezones'
import 'bootstrap/dist/css/bootstrap.min.css';
import './timezone.css';
import '../lib/jquery-jvectormap.css';
import { VectorMap } from 'react-jvectormap';
import { worldTimeZoneList } from './timezonegdp';
import update from 'immutability-helper';
import { fetchFn } from '../lib/apiCall';
import { ToastContainer} from 'react-toastify';
import { notify } from '../lib/notificaton'
import Header from '../header/header';
import SideBar from '../side-bar/sidebar';

class Timezone extends React.Component {
    country = [1,2,3];
    timezone = [];
    timezoneList=[];
    timezoneObject = {};
    regionSelect='IN'
    jVectorMapRegion = [];
    constructor(){
        super();
        this.state = {
            regionSelect:'',      //Default set to India
            data:[],
            checkRegion:''
        }
        this.regionClick = this.regionClick.bind(this);
        this.regionSelected = this.regionSelected.bind(this);
        this.markerSelected = this.markerSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveTimeZone = this.saveTimeZone.bind(this);
    }
    regionClick(e, countrycode){
        console.log('Region Click Code', countrycode);
        this.setState({
            regionSelect:countrycode
        })
        this.timezoneList.map((value, index)=>{
            this.timezone.push(value.title);
        });
        this.setState({
            checkRegion:countrycode
        })
        console.log('Region ', this.state);
    }
    regionSelected(e, code, isSelected){
        // console.log('Region Selected --> ',e, isSelected);
        // console.log('Fetch the time zone',);
    }
    markerSelected(e, code, isSelected){
        // console.log('Marker Selcted --> ', code);
        // console.log(marker1[code]);
    }
    handleChange(e){
        let countryId = e.target.value;
        console.log('Handle change Id-->',countryId);
        let mapObj = this.refs.map.$mapObject;
        this.jVectorMapRegion.push(mapObj.regions);
        if(countryId != null && countryId){
            //check for JVECTOR MAP Regions availability
            if(this.jVectorMapRegion[0][countryId]){
                mapObj.clearSelectedRegions();
                mapObj.setSelectedRegions(countryId); 
                // Set state here
                console.log('Red -State',this.state);
                let savedStateValue = this.state.checkRegion;
                let updatedStateValue= update(savedStateValue,{$set:countryId});
                this.setState({
                    checkRegion:updatedStateValue,
                    regionSelect:updatedStateValue
                })
                console.log('Now state after update --> ', this.state);           
            }else {
                // notify('Region Not available', 'error')
                console.log('Invalid regions --> ', countryId);
            }
        }else{
            // mapObj.clearSelectedRegions();
            console.log('Error Occured');
        }
                
    }
    saveTimeZone(){
        console.log('Save state to hit the API and fetch the saved value -->', this.state.checkRegion);
        //Fetch the Data and then set the state[checkRegion, regionSelect] to update the map.
        // API URL --> https://app.acquire.io/api/account/setting/save-theme

        fetchFn('account/setting/save-theme', {"chat_setting":"Save Changes", "setting_log_type":"operating_hour","timezone":this.state.checkRegion})
            .then((response)=>{
                return response.json()
            })
            .then((result)=>{
                console.log('Result --> ', result);
                // this.setState()
            })
            .catch((err)=>{
                console.error(err);
                console.warn('Error catched');
            })
    }
    componentWillMount(){
        worldTimeZoneList.map((value, i)=>{
            // console.log(value); 
        })
        this.setState({
            data:worldTimeZoneList
        })
        fetchFn('account/setting/get-all-setting',{})
            .then((response)=>{
                return response.json()
            })
            .then((result)=>{
                if(result.success = true){
                    console.log(result.data.timezone);
                    let timezone = result.data.timezone;
                    let savedTimeZone = '';
                    worldTimeZoneList.map((item, index)=>{
                        // console.log(item.countryCode);
                        if(item.countryCode == timezone.value){
                            console.log('-->',item);
                            savedTimeZone = item; 
                        }
                    });
                    console.log('x', savedTimeZone);
                    this.setState({
                        regionSelect:savedTimeZone.countryCode,
                        checkRegion:savedTimeZone.countryCode
                    });
                    let mapObj = this.refs.map.$mapObject;
                    mapObj.setSelectedRegions(timezone.value);
                    console.log('Updated',this.state);
                }else {
                    notify('Error Occured', 'error');
                }
            })
            .catch((err)=>{
                notify('Failed to hit API', 'error');
                console.error(err);
                console.warn('Error Occured during Component will Mount');
            });

    }
    render(){
        //Adding Inline style
        let dropdown = {
            width:'650px'
        };
        return (
            <div>
                <div className="col-sm-12">
                    <Header/>
                </div>
                <SideBar/>
                <div clasName="col-sm-12"> ssssssss</div>
                <div className="container">
                    <div className="col-sm-12">
                        <ToastContainer autoClose={3000}/>
                            <div className="worldmap" ref="worldmap">
                                <VectorMap 
                                    map={'world_mill'}
                                    zoomOnScroll={false}
                                    ref="map"
                                    regionsSelectableOne= {false}
                                    containerStyle={{
                                        width:'950px',
                                        height: '450px'
                                    }}
                                    containerClassName="map"
                                    selectedRegions={this.state.regionSelect}
                                    onRegionClick= {this.regionClick}
                                    onRegionSelected= {this.regionSelected}
                                    onRegionTipShow = {(e,el,code)=>{
                                        e.preventDefault();
                                    }}
                                    // series={{
                                    //     regions:[
                                    //         {
                                    //             values: gdpData,
                                    //             scale: ["#146804", "#ff0000"],
                                    //         }
                                    //     ]
                                    // }}
                                    // markers = {marker1} 
                                    // markersSelectable={true}
                                    // markersSelectableOne={true}
                                    // onMarkerClick={this.markerSelected}
                                />
                            </div>
                    </div>
                    {/* <div className="col-sm-12"><br/></div> */}
                    <div className="col-sm-12">
                        <div className="dropdown pt-3" style={dropdown}>
                            <select className="form-control" value={this.state.checkRegion} onChange={this.handleChange}>
                                {
                                    this.state.data.map((zone,i)=>{
                                        return <option className="form-control" value={zone.countryCode} key={i}>{zone.text}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="pt-3">
                            <button className="btn btn-success" onClick={this.saveTimeZone}>Save</button>
                        </div>
                    </div>
                </div>
            </div>            
        )
    }
} 
export default Timezone;

