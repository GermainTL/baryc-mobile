import React, { Component } from 'react';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';
import palette from '~/constants/Colors.ts';
import { parisLocalization } from '~/constants/GPSConstants.ts';
import {
  getArrayDepth,
  polygonDepth,
  multiPolygonDepth,
} from '~/helpers/CoordinatesHelper';
import { getMarkersFromLocations } from '~/helpers/MarkersHelper.tsx';
import PulsatingCircle from 'react-native-pulsating-circle';
const markerImage = require('~/assets/images/marker.png');

export default class Map extends Component {
  render(): JSX.Element {
    const usersLocationMarkers = getMarkersFromLocations(this.props.locations);
    return (
      <MapView
        style={styles.map}
        initialRegion={parisLocalization}
        showsUserLocation={true}
      >
        {usersLocationMarkers.map((marker, index) => {
          return (
            <Marker coordinate={marker.coordinates} key={marker.key}>
              <PulsatingCircle
                mainCircleSize={20}
                mainCircleBorder={4}
                mainCircleColor={'white'}
                pulseCircleColor={palette.polygonColors[index].userIconColor}
                pulseCircleSize={20}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        palette.polygonColors[index].userIconColor,
                    },
                  ]}
                />
              </PulsatingCircle>
            </Marker>
          );
        })}
        {this.props.isLoading === false &&
          this.props.markers.map(marker => {
            return (
              <Marker
                coordinate={marker.coordinates}
                title={marker.title}
                key={marker.key}
                onCalloutPress={() =>
                  this.props.navigation.navigate('Bar', {
                    barId: marker.key,
                  })
                }
              >
                <Image source={markerImage} style={{ height: 20, width: 20 }} />
              </Marker>
            );
          })}
        {this.props.isochronesCoordinates[0].reformattedCoordinates.length >
          0 &&
          this.props.isochronesCoordinates.map(
            (isochroneCoordinates, isochroneCoordinatesIndex) => {
              if (
                getArrayDepth(isochroneCoordinates.coordinates) ===
                multiPolygonDepth
              ) {
                // MultiPolygon
                return isochroneCoordinates.reformattedCoordinates.map(
                  multiPolygon => {
                    return multiPolygon.map((polygon, index) => {
                      return (
                        <Polygon
                          key={index}
                          coordinates={polygon}
                          strokeColor={
                            palette.polygonColors[isochroneCoordinatesIndex]
                              .strokeColor
                          }
                          strokeWidth={3}
                          zIndex={1}
                          fillColor={
                            palette.polygonColors[isochroneCoordinatesIndex]
                              .fillColor
                          }
                        />
                      );
                    });
                  },
                );
              } else if (
                getArrayDepth(isochroneCoordinates.coordinates) === polygonDepth
              ) {
                // Polygon
                return isochroneCoordinates.reformattedCoordinates.map(
                  (polygon, index) => {
                    return (
                      <Polygon
                        key={index}
                        coordinates={polygon}
                        strokeColor={
                          palette.polygonColors[isochroneCoordinatesIndex]
                            .strokeColor
                        }
                        strokeWidth={3}
                        zIndex={1}
                        fillColor={
                          palette.polygonColors[isochroneCoordinatesIndex]
                            .fillColor
                        }
                      />
                    );
                  },
                );
              }
            },
          )}
        {this.props.intersection !== null &&
          this.props.intersection.reformattedCoordinates.length > 0 &&
          getArrayDepth(this.props.intersection.coordinates) ===
            multiPolygonDepth && // MultiPolygon
          this.props.intersection.reformattedCoordinates.map(
            (multiPolygon, multiPolygonIndex) => {
              return multiPolygon.map((polygon, polygonIndex) => {
                return (
                  <Polygon
                    key={`${multiPolygonIndex}:${polygonIndex}`}
                    coordinates={polygon}
                    strokeColor={'white'}
                    strokeWidth={3}
                    fillColor={'rgba(255,255,255,0.16)'}
                    zIndex={2}
                  />
                );
              });
            },
          )}
        {this.props.intersection !== null &&
          this.props.intersection.reformattedCoordinates.length > 0 &&
          getArrayDepth(this.props.intersection.coordinates) === polygonDepth &&
          this.props.intersection.reformattedCoordinates.map(
            (polygon, polygonIndex) => {
              return (
                <Polygon
                  key={`${polygon}:${polygonIndex}`}
                  coordinates={polygon}
                  strokeColor={'white'}
                  strokeWidth={3}
                  fillColor={'rgba(255,255,255,0.16)'}
                  zIndex={2}
                />
              );
            },
          )}
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
  dot: {
    position: 'absolute',
    zIndex: 1000,
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
});
