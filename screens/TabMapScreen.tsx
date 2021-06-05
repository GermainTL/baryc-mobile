import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Icon, ButtonGroup, Button } from "react-native-elements";
import { getBarsFromApi, getMarkersFromBars } from "~/helpers/API/BarsAPI.tsx";
import { geocode } from "~/helpers/API/Geocoder.tsx";
import transportOptions from "~/constants/TransportOptions.tsx"
import SearchBarWithOptions from "~/components/SearchBarWithOptions.tsx";
import Map from "~/components/Map.tsx";
import { retrieveNewMapElements } from "~/helpers/CoordinatesHelper.tsx";
import BarycLoader from "~/components/BarycLoader";

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
    {
      reformattedCoordinates: [],
      coordinates: []
    },
  ],
  intersection: null
}

export default class TabMapScreen extends Component {
  constructor(){
    super();
    this.state = INITIAL_STATE
  }

  componentDidMount(): void {
    getBarsFromApi().then((bars) => {
      const markers = getMarkersFromBars(bars)
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

  onSearchButtonPress(): void {
    retrieveNewMapElements(this.state.locations)
      .then((newMapElements) => {
        this.setState({
          isochronesCoordinates: newMapElements.newIsochronesCoordinates,
          intersection: newMapElements.newIntersection,
          markers: newMapElements.newMarkers || this.state.markers,
          showSearchPanel: false
        })
      })
  }

  render(): JSX.Element {
    const { markers, isLoading, showSearchPanel, selectedTransport, locations, isochronesCoordinates, intersection } = this.state

    return (
        <View style={ styles.container }>
          <BarycLoader visible={ isLoading } containerStyle={ styles.loaderContainer } type={ 'rotating' } />
          {
            showSearchPanel === false && isLoading === false &&
            <Map
              isLoading={ isLoading }
              markers={ markers }
              isochronesCoordinates={ isochronesCoordinates }
              intersection={ intersection }
            />
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
                          onPress={() => this.onSearchButtonPress() }
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
  loaderContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '33%',
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
      zIndex: 3,
      flex: 1,
      height: "100%",
      flexGrow: 1,
      backgroundColor: "white",
    },
    transportButtons: {
      zIndex: 0,
    }
});
