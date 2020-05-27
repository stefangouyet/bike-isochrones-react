import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, {Component} from 'react';
import Geocoder from "react-map-gl-geocoder";
import MapGL, {Source, Layer,Marker,NavigationControl} from 'react-map-gl';
//import Geocoder from '@mapbox/react-geocoder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBiking,faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
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
        zoom: 11,
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
    this.setState({
      minutes:event.target.value
    })
  }
  
  handleProfileChange = event => {
    this.setState({
      profile:event.target.value
    })
    console.log(this.state.profile)
  }
  handleIconChange = selectedOption => {
    this.setState({
      faIcon: selectedOption
    });
  }

 
  render() {
    
    const { viewport } = this.state;
   
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

          <Geocoder 
              mapRef={this.mapRef}
              onResult={this.handleOnResult}
              onViewportChange={this.handleGeocoderViewportChange}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              position="top-left"
            />

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
          <FontAwesomeIcon icon={faMapMarkerAlt} size='2x' color='blue' />
          
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
              'fill-color': '#007AFB',
              'fill-opacity': 0.3
              }}/>
            
            </Source>
         
        </MapGL>

        <div className='sidebar'>
         
          <h4>Maximum Travel Time:</h4>
          <label>{this.state.minutes} mins. </label>
            <input 
              name='time' 
              type='range' 
              min={15} 
              max={60}
              defaultValue={30}
              onChange={this.handleTimeChange}
              step = "5"
            />

          

          </div>
        
        </div>
     
    );
  }
}
export default App;