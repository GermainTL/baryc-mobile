import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Icon, ButtonGroup, Button } from "react-native-elements";
import { parisLocalization } from "~/constants/GPSConstants.ts";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";
import { getIsochronesCoordinates } from "~/helpers/API/NavitiaAPI.tsx";
import { geocode } from "~/helpers/API/Geocoder.tsx";
import transportOptions from "~/constants/TransportOptions.tsx"
import SearchBarWithOptions from "~/components/SearchBarWithOptions.tsx";
import palette from "~/constants/Colors.ts";

const markerImage = require('~/assets/images/marker.png');

const INITIAL_STATE = {
  markers: [],
  isLoading: true,
  showSearchPanel: false,
  locations: [
    {
      searchValue: '',
      GPSPosition: {
        latitude: null,
        longitude: null
      },
      options: []
    },
    {
      searchValue: '',
      GPSPosition: {
        latitude: null,
        longitude: null
      },
      options: []
    },
  ],
  selectedTransport: null,
  isochronesCoordinates: [
      [],
  ]
}

export default class TabMapScreen extends Component {
  constructor(){
    super();
    this.state = INITIAL_STATE
  }

  componentDidMount(): void {
    getBarsFromApi().then((data) => {
      const markers = []
      for (const bar of data) {
        markers.push({
          coordinates: {
            longitude: bar.coordinates[0],
            latitude: bar.coordinates[1],
          },
          title: bar.nom,
          key: bar.id
        })
      }
      this.setState({
        markers: markers,
        isLoading: false,
      });
    })
  }
  
  togglePanel(): void {
    this.setState((prevState) => {
      return {
        showSearchPanel: prevState.showSearchPanel !== true
      }
    });
  }

  updateSelectTransport(selectedTransport): void {
    this.setState({ selectedTransport: selectedTransport})
  }

  handleSearch(searchText, index): void {
    if (searchText === '') {
      return
    }
    const locations = [ ...this.state.locations ]
    const location = { ...locations[index] }
    location.searchValue = searchText
    locations[index] = location

    this.setState({ locations: locations })

    geocode(searchText).then((data) => {
      const locations = [ ...this.state.locations ]
      const location = { ...locations[index] }
      location.options = data
      locations[index] = location
      this.setState({ locations: locations })
    })
  }

  selectLocation(location: Object, index: Number): void {
    const locations = [ ...this.state.locations ]
    locations[index] = location
    this.setState({ locations: locations })
  }

  clearLocation(index): void {
    const locations = [ ...this.state.locations ]
    locations[index] = INITIAL_STATE.locations[index]
    this.setState({ locations: locations })
  }

  render(): JSX.Element {
    const { markers, isLoading, showSearchPanel, selectedTransport, locations, isochronesCoordinates } = this.state

    return (
        <View style={ styles.container }>
          {
            showSearchPanel === false &&
            <MapView
                style={styles.map}
                initialRegion={parisLocalization}
                showsUserLocation={true}
            >
              {
                isLoading === false && (
                    markers.map((marker) => {
                      return (
                          <Marker
                              coordinate={ marker.coordinates }
                              title={ marker.title }
                              key={ marker.key }
                          >
                              <Image source={ markerImage } style={{ height: 20, width: 20 }}/>
                          </Marker>
                      )
                    })
                )
              }
              {
                isochronesCoordinates[0].length > 0 && (
                   isochronesCoordinates.map((isochroneCoordinates, isochroneCoordinatesIndex) => {
                     return (
                      isochroneCoordinates.map((multiPolygon, multiPolygonIndex) => {
                        return (
                            <Polygon key={ multiPolygonIndex } coordinates={ multiPolygon[0] } strokeColor={ palette.polygonColors[isochroneCoordinatesIndex].strokeColor }
                                     strokeWidth={ 3 } fillColor={ palette.polygonColors[isochroneCoordinatesIndex].fillColor }/>
                        )
                      })
                     )
                   })
                )
              }
            </MapView>
          }

          <TouchableOpacity
              style={ styles.searchButton }
              onPress={() => this.togglePanel() }
          >
            <Icon
                name="search-outline"
                reverse
                type="ionicon"
                color="white"
                reverseColor="black"
            />
          </TouchableOpacity>

          {
            showSearchPanel === true && (
                  <ScrollView
                      onScrollEndDrag={() => this.togglePanel()}
                      contentContainerStyle={ styles.searchPanel }
                      scrollEventThrottle={ 15 }
                  >
                    <Icon
                        name="chevron-double-down"
                        type="material-community"
                        color="black"
                       />
                      <SearchBarWithOptions
                          handleSearch={ this.handleSearch.bind(this) }
                          clearLocation={ this.clearLocation.bind(this) }
                          selectLocation={ this.selectLocation.bind(this) }
                          placeholder={ "Your position" }
                          value={ locations[0].searchValue }
                          options={ locations[0].options }
                          locationIndex={ 0 }
                          containerStyle={{ zIndex: 2 }}
                      />
                      <SearchBarWithOptions
                          handleSearch={ this.handleSearch.bind(this) }
                          clearLocation={ this.clearLocation.bind(this) }
                          selectLocation={ this.selectLocation.bind(this) }
                          placeholder={ "Your friend's position" }
                          value={ locations[1].searchValue }
                          options={ locations[1].options }
                          locationIndex={ 1 }
                          containerStyle={{ zIndex: 1 }}
                      />
                      <ButtonGroup
                          containerStyle={{ zIndex: 0 }}
                          buttonContainerStyle={{ paddingTop: 8 }}
                          onPress={(index) => this.updateSelectTransport(transportOptions[index].value) }
                          selectedIndex={ selectedTransport }
                          buttons={ transportOptions.map((transportOption) => {
                            return transportOption.displayValue
                          }) }
                      />
                      <Button
                          title="search"
                          onPress={() => {
                            for (const index in locations) {
                              if (locations[index].GPSPosition.latitude !== null) {
                                getIsochronesCoordinates(30, locations[index].GPSPosition)
                                    .then((newIsochronesCoordinates) => {
                                      const shadowIsochronesCoordinates = [ ...this.state.isochronesCoordinates ]
                                      shadowIsochronesCoordinates[index] = newIsochronesCoordinates
                                      this.setState({ isochronesCoordinates: shadowIsochronesCoordinates })
                                    })
                              }
                            }
                          }}
                      />
                  </ScrollView>
            )
          }
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  searchButton: {
    backgroundColor: 'transparent',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: "white",
    shadowColor: '#000',
      shadowOffset: {
        width: 0, height: 10
      },
    shadowOpacity: 0.2,
    elevation: 1,
    },
    searchPanel: {
      flex: 1,
      height: "100%",
      flexGrow: 1,
      backgroundColor: "white",
    },
    transportButtons: {
      zIndex: 0,
    }
});
