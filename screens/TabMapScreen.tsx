import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icon, Card, SearchBar, ButtonGroup } from "react-native-elements";

import { parisLocalization } from "~/constants/GPSConstants.ts";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";
import palette from "~/constants/Colors.ts" ;

export default class TabMapScreen extends Component {
  constructor(){
    super();
    this.state= {
      markers: [],
      isLoading: true,
      showSearchPanel: false,
      locations: [
          {
            searchValue: '',
            location: {
              latitude: null,
              longitude: null
            }
          },
          {
            searchValue: '',
            location: {
              latitude: null,
              longitude: null
            }
          },
      ],
      selectedTransport: null
    }
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

  updateSelectedOption(selectedOption): void {
    this.setState({ selectedTransport: selectedOption})
  }

  handleSearch(searchText, index): void {
    const locations = [ ...this.state.locations ];
    const location = { ...locations[index] };
    location.searchValue = searchText;
    locations[index] = location;
    this.setState({ locations});
  }

  render(): JSX.Element {
    const { markers, isLoading, showSearchPanel, selectedTransport } = this.state;
    const transportOptions = ['walk', 'transport']
    
    return (
        <View style={ styles.container }>
          <MapView
              style={ styles.map }
              initialRegion={ parisLocalization }
              showsUserLocation={ true }
          >
            {
              isLoading === false && (
                markers.map((marker) => {
                return  (
                    <Marker
                        coordinate={ marker.coordinates }
                        title={ marker.title }
                        key={ marker.key }
                    >
                      <Icon name="map-marker" type="font-awesome" color={ palette.barycOrangeLight } style={ palette.iconShadow }/>
                    </Marker>
                )
               })
              )
            }
          </MapView>

          <TouchableOpacity style={ styles.searchButton } onPress={() => this.togglePanel() }>
            <Icon name="search-outline" reverse type="ionicon" color="white" reverseColor="black"/>
          </TouchableOpacity>

          {
            showSearchPanel === true && (
                <ScrollView onScroll={() => this.togglePanel()} style={ styles.searchPanel } scrollEventThrottle={0}>
                  <Card containerStyle={ styles.card } >
                    <View>
                      <SearchBar onChangeText={(text) => this.handleSearch(text, 0) } value={ this.state.locations[0].searchValue } lightTheme containerStyle={ styles.searchBar } />
                      <SearchBar onChangeText={(text) => this.handleSearch(text, 1) } value={ this.state.locations[1].searchValue } lightTheme containerStyle={ styles.searchBar } />
                      <ButtonGroup
                          onPress={(value) => this.updateSelectedOption(transportOptions[value]) }
                          selectedIndex={ selectedTransport }
                          buttons={ transportOptions }
                      />
                    </View>
                  </Card>
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
    position: "relative"
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
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: Dimensions.get('window').width
    },
    card: {
      marginLeft: 0,
      marginRight: 0,
    },
    searchBar: {
      backgroundColor: "white",
      borderTopColor: "white",
      borderBottomColor: "white"
    },
});
