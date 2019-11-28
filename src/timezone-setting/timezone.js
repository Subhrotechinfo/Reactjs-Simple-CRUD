import React from 'react';
import * as cnty from 'countries-and-timezones'
import 'bootstrap/dist/css/bootstrap.min.css';
import './timezone.css';
import '../lib/jquery-jvectormap.css';
// import $ from 'jquery';
// import  window from 'jquery';
// import jQuery from 'jquery';
import { VectorMap } from 'react-jvectormap';
import { thisTypeAnnotation } from '@babel/types';

class Timezone extends React.Component {
    country = [];
    timezone = 'null';
    timezoneList = [];
    constructor(){
        super();
        this.state = {
            regionSelect:'IN'
        }
        this.regionClick = this.regionClick.bind(this);
        this.regionSelected = this.regionSelected.bind(this);
    }
    regionClick(e, countrycode){
        console.log('Region selected Code', countrycode);
        this.setState({
            regionSelect:countrycode
        })
        console.log('Fetch the time zone');
        this.fetchTimeZone(countrycode);
    }
    regionSelected(e, code, isSelected){
        // console.log('Region Selected --> ',e, isSelected);
        // console.log('Fetch the time zone',);
    }
    fetchTimeZone = (countryCode) => {
        console.log('Called')
        this.timezone = cnty.getAllTimezones();
        console.log('Timezone --> ', this.timezone);
        // (UTC-06:00) Guadalajara, Mexico City, Monterrey
        // fetch('')
    }
    
    componentWillMount(){
        // this.drawMap();
        // this.country = cnty.getAllCountries();
        // const countryValues = Object.values(this.country)
        // console.log('Value', countryValues);
        // for(let item of countryValues){
        //     console.log(item.timezones[0]);
        //     this.timezone = cnty.getTimezone(item.timezones[0]);
        //     this.timezoneList.push('GMT');

        //     console.log(this.timezone)
        // }
        // console.log('Country --> ', this.country);
        // console.log('Timezone --> ', this.timezone);
    }
    render(){
        return (
            <div className="container">
                <div className="col-sm-12">
                    <div className="dropdown">
                        <select className="form-control">
                            <option>1</option>
                        </select>
                    </div>
                    
                    <div className="worldmap">
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
                            />
                        </div>
                        
                    </div>
                </div>
            
        )
    }
} 
export default Timezone;

