import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { parisLocalization } from "~/constants/GPSConstants.ts";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";

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
                  />
              )
             })
            )
          }
        </MapView>
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
});
