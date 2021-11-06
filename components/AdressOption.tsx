import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';


export default class AdressOption extends Component {
    formatLocation(): Object {
        return {
            searchValue: this.props.option.item.properties.label,
            GPSPosition: {
                latitude: this.props.option.item.geometry.coordinates[1],
                longitude: this.props.option.item.geometry.coordinates[0]
            },
            options: []
        }
    }

    render(): JSX.Element {
        return (
            <TouchableOpacity
                onPress={() => this.props.selectLocation(this.formatLocation(), this.props.locationIndex) }
            >
                <Text style={ styles.option }>{ this.props.option.item.properties.label }</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    option: {
        backgroundColor: 'white',
        zIndex: 5,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10
    }
})