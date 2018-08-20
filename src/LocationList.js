import React, { Component } from "react";
import Location from "./Location";

class LocationList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      locationList: "",
      query: "",
      suggestions: true
    };

    this.filterLocations = this.filterLocations.bind(this);
  }


  filterLocations(event) {
    this.props.closeInfoWindow();
    const { value } = event.target;
    var locationList = [];
    this.props.locations.forEach(function(location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locationList.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locationList: locationList,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      locationList: this.props.locations
    });
  }

  render() {
    var locationlist = this.state.locationList.map(function(listItem, index) {
      return (
        <Location
          key={index}
          openInfoWindow={this.props.openInfoWindow.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-header">
      <label className="search-label">Neha Locations</label>
      <div className="search-area">
        <input
          role="search"
          aria-labelledby="filter"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="Filter"
          value={this.state.query}
          onChange={this.filterLocations}
        />
        <ul className="location-list">
          {this.state.suggestions && locationlist}
        </ul>
      </div>
      </div>
    );
  }
}

export default LocationList;