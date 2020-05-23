//import 'mapbox-gl/dist/mapbox-gl.css';

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, {Component} from 'react';
//import Geocoder from 'react-mapbox-gl-geocoder';
import Geocoder from "react-map-gl-geocoder";
//import ReactMapGL, {Layer,Source} from 'react-map-gl';
import MapGL, {Source, Layer,Marker,NavigationControl} from 'react-map-gl';
import {json as requestJson} from 'd3-request';
//import Geocoder from '@mapbox/react-geocoder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import {fawalking} from '@fortawesome/free-solid-svg-icons';
import {faBiking,faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
//import InputRange from 'react-input-range';

//import DeckGL, { GeoJsonLayer } from "deck.gl";
import { GeoJsonLayer } from "deck.gl";
import './App.css';

 

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

const urlBase =  'https://api.mapbox.com/isochrone/v1/mapbox/';

//const mapStyle= "mapbox://styles/stefangouyet/ck8v4xh0j20001jm6a1wlo41g"
const mapStyle = 'mapbox://styles/andregoo/ckahcb1sp02im1ikgfsefbboi'

class App extends Component {
 
    state = {
      viewport: { 
        latitude: 38.907,
        longitude: -77.036,
        zoom: 10,
        maxZoom:15
      },
      isLoaded:true,
      items:null,
      profile: 'cycling', 
      minutes: 30,
      events: {},
      searchResultLayer: null,
      faIcon: faMapMarkerAlt
       };

       
    

    mapRef = React.createRef();

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };
  
  onSelected = (viewport, item) => {
    this.setState({viewport});
    console.log('Selected: ', item)
  }

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1500 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    console.log(event.result);
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  handleTimeChange = event => {
    console.log(event.target.value);
    this.setState({
      minutes:event.target.value
    })
  }
  //handleTimeChange = this.handleTimeChange.bind(this);

  handleProfileChange = event => {
    //console.log(event.target.value);
    this.setState({
      profile:event.target.value
    })
    console.log(this.state.profile)
  }
  handleIconChange = selectedOption => {
    //console.log(event.target.value);
    this.setState({
      faIcon: selectedOption
    });
  }
  //handleIconChange = this.handleIconChange.bind(this);

 
  render() {
    
    

    var query =  (urlBase + this.state.profile + '/' + 
                  this.state.viewport.longitude + ',' + this.state.viewport.latitude + 
                  '?contours_minutes=' + this.state.minutes + '&polygons=true&access_token=' + 
                  MAPBOX_TOKEN);
                  
    // console.log(this.state);
    // console.log('url is: ' + urlBase + this.state.profile + '/' + 
    // this.state.viewport.longitude + ',' + this.state.viewport.latitude + 
    // '?contours_minutes=' + this.state.minutes + '&polygons=true&access_token=' + 
    // process.env.REACT_APP_MAPBOX_TOKEN);
    
    
   // const {viewport} = this.state
   const { viewport, searchResultLayer } = this.state;



            
    return (
      
      <div style={{height:"100vh"}}> 
      <MapGL
          {...viewport}
          width="100vw"
          height="100vh"
          ref = {this.mapRef}
          {...viewport}
          onViewportChange={this.handleViewportChange}
          mapStyle={mapStyle}
          //onViewportChange={this._updateViewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {/* <div className='navStyle'>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div> */}

        
          <Geocoder 
              mapRef={this.mapRef}
              onResult={this.handleOnResult}
              onViewportChange={this.handleGeocoderViewportChange}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              position="top-left"
            />
            {/* <DeckGL {...viewport} layers={[searchResultLayer]} /> */}
            
       
        

        <Marker
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          //draggable
          onDragStart={this._onMarkerDragStart}
          onDrag={this._onMarkerDrag}
          //onDragEnd={this._onMarkerDragEnd}
          onViewportChange = {(viewport) => this.setState({viewport})}

        >
          <FontAwesomeIcon icon={this.state.faIcon} size='2x' color='blue' />

        </Marker>
 
        <Source 
        id = 'iso'
        type = 'geojson'
        data = {urlBase + this.state.profile + '/' + 
                viewport.longitude + ',' + viewport.latitude + 
                  '?contours_minutes=' + this.state.minutes + '&polygons=true&access_token=' + 
                  process.env.REACT_APP_MAPBOX_TOKEN} >
        
        <Layer 
        type="fill"
        layout={{}}
        source = 'iso'
        paint = {{
          'fill-color': '#007AFB',//'#5a3fc0',
          'fill-opacity': 0.3
          }}/>
        
        </Source>
         
        </MapGL>

        <div className='control-panel'>
            
          {/* <form id='params' onSubmit = {this.handleFormSubmit}> */}
          {/* <h4>Chose a travel mode:</h4>
                    
          <label className='toggle-container'/>
            <input 
            name='profile' 
            type='radio' 
            value='walking'
            onChange = {this.handleProfileChange}
            checked={this.state.profile === 'walking'}
            />
      
          <label className='toggle-container'>
            <input name='profile' 
            type='radio' 
            value='cycling' 
            checked={this.state.profile === 'cycling'}
            onchange = {this.handleProfileChange}>

            </input>
            <div className='toggle toggle--active-null toggle--null'>Cycling</div>
          </label> */}


          {/* </form> */}
            

          
          <h4>Maximum Travel Time:</h4>
          <label className='toggle-container'>{this.state.minutes} mins. </label>
            <input 
              name='time' 
              type='range' 
              min={15} 
              max={60}
              defaultValue={30}
              //value={this.state.minutes}
              onChange={this.handleTimeChange}
              step = "5"
            />
          {/* <label> Toggle Middle Icon </label>

          {/* <form onSubmit={this.handleSubmit}> */}
          {/* <Select 
          value={this.state.faIcon} 
          onChange={this.handleIconChange}
          options = {faBiking, faMapMarkedAlt}
          >
            <option value={faBiking}>faBiking</option>
            <option value={{faMapMarkedAlt}}>faMapMarkedAlt</option>
          </Select> */} 
          {/* </form> */}

          

          </div>
        
        </div>
     
    );
  }
}
export default App;