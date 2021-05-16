import React, { Component } from 'react';
import MapView, { Marker, Polygon } from "react-native-maps";
import { Image, StyleSheet } from "react-native";
import palette from "~/constants/Colors.ts";
import { parisLocalization } from "~/constants/GPSConstants.ts";
const markerImage = require('~/assets/images/marker.png');

export default class Map extends Component {
    render(): JSX.Element {
        return (
            <MapView
                style={ styles.map }
                initialRegion={ parisLocalization }
                showsUserLocation={ true }
            >
            {
                this.props.isLoading === false && (
                    this.props.markers.map((marker) => {
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
                this.props.isochronesCoordinates[0].length > 0 && (
                    this.props.isochronesCoordinates.map((isochroneCoordinates, isochroneCoordinatesIndex) => {
                        return (
                            isochroneCoordinates.map((multiPolygon, multiPolygonIndex) => {
                                return (
                                    <Polygon key={ multiPolygonIndex} coordinates={multiPolygon[0] }
                                             strokeColor={ palette.polygonColors[isochroneCoordinatesIndex].strokeColor }
                                             strokeWidth={ 3 }
                                             fillColor={ palette.polygonColors[isochroneCoordinatesIndex].fillColor }/>
                                )
                            })
                        )
                    })
                )
            }
            </MapView>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    }
})