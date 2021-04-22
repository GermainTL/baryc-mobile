import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icon } from "react-native-elements";

import { parisLocalization } from "~/constants/GPSConstants.ts";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";
import { default as palette } from "~/constants/Colors.ts" ;

export default class TabMapScreen extends Component {
  constructor(){
    super();
    this.state= {
      markers: [],
      isLoading: true
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
        isLoading: false
      });
    })
  }

  render(): JSX.Element {
    const { markers, isLoading } = this.state;

    return (
        <View style={{ flex: 1 }}>
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
        <TouchableOpacity style={ styles.searchButton }>
          <Icon name="search-outline" reverse type="ionicon" color="white" reverseColor="black" style={ palette.iconShadow } />
        </TouchableOpacity>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  searchButton: {
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
    elevation: 1
  }
});
