import React, { Component } from "react";
import LocationList from "./LocationList";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: require("./locations.json"), // Get the locations from the JSON file
      map: "",
      infowindow: "",
      previousMark: ""
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCUG7bkduNBKAYo8uMCC9WwI80cv4rZXco&callback=initMap"
      );
  }

  initMap() {
    var self = this;
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.5723186, lng: -79.6048425 },
      zoom: 15,
      mapTypeControl: false
    });

    var InfoWindow = new window.google.maps.InfoWindow({});
    let bounds = new window.google.maps.LatLngBounds();

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    var locations = [];
    this.state.locations.forEach(function(location) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
          ),
        animation: window.google.maps.Animation.DROP,
        title: location.name + " , " + location.country,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfoWindow(marker);
      });

      location.longname = location.name;
      location.marker = marker;
      location.display = true;
      locations.push(location);
      bounds.extend(marker.position);
    });
    this.setState({
      locations: locations
    });

    map.fitBounds(bounds);
  }

   openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      previousMark: marker
    });
    this.state.infowindow.setContent("Loading data...");
    this.state.map.setCenter(marker.getPosition());
    this.geocodeAddress(this.state.map, marker);
  }

  geocodeAddress(resultsMap, marker) {
    var self = this;
    var address = marker.title;
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        var addressTitle = address.split(',')[0];
        self.state.infowindow.setContent("<div><strong>" + addressTitle +"</strong><div>" + results[0].formatted_address+"</div>" +"</div>");
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  closeInfoWindow() {
    if (this.state.previousMark) {
      this.state.previousMark.setAnimation(null);
    }
    this.setState({
      previousMark: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div>
      <LocationList
      key="100"
      locations={this.state.locations}
      openInfoWindow={this.openInfoWindow}
      closeInfoWindow={this.closeInfoWindow}
      />
      <div id="map" />
      </div>
      );
    }
  }

  export default App;


  function loadMapJS(src){
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }