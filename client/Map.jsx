var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
const { Marker } = require('mapbox-gl');
import React, {Component} from 'react'

export default class Map extends Component {

  constructor(props){
    super(props)

    this.state = {

    }

    this.markers = []

    this.buildMarker = this.buildMarker.bind(this)
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.concerts !== this.props.concerts){
      this.markers.forEach(marker => {
        marker.remove()
      })
      this.markers = []
    }
  }

  componentDidMount(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRrbyIsImEiOiJjamFsdmhiemEydzNsMndvaTAzcDlsMzdyIn0.cgE2juAhXiZnis4o-sfEZw'

    const fullstackCoords = [-74.009, 40.705]

    this.map = new mapboxgl.Map({
      container: this.container,
      center: fullstackCoords,
      zoom: 12, // starting zoom
      style: 'mapbox://styles/mapbox/streets-v10' // mapbox has lots of different map styles available.
    })
    }

    buildMarker(concert){

      const markerEl = document.createElement('div');
      markerEl.style.backgroundSize = 'contain';
      markerEl.style.backgroundImage = "url('https://www.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png')";
      markerEl.style.width = '32px';
      markerEl.style.height = '37px';
      markerEl.addEventListener('click', () => {
        this.props.addConcert(concert)
      })
      return new mapboxgl.Marker(markerEl)
      .setLngLat([concert.location.lng, concert.location.lat])
      .setPopup(new mapboxgl.Popup({offset: 25, closeOnClick: false})
      .setHTML(`<h3>${concert.displayName}</h3><h4>${concert.venue.displayName}</h4>${concert.performance.map(singleperformance => `<p>${singleperformance.artist.displayName}</p>`).join('')}`))
    }

    render(){


      if (this.props.concerts.length){
        this.props.concerts.forEach(concert => {
          this.markers = this.markers.concat(this.buildMarker(concert))
        })
      }

      if (this.markers.length){
        this.markers.forEach(marker => {
          marker.addTo(this.map)
        })
      }

      return (
        <div id = "map" ref = {(map) => {this.container = map}} />
      )
    }
  }

