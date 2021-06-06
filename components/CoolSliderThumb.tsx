import React, { Component } from 'react';
import { View, Text, StyleSheet } from "react-native";
import palette from "~/constants/Colors.ts" ;

export default class Options extends Component {
    render(): JSX.Element {
        return (
            <View style={ styles.containerStyle }>
                <View style={ styles.thumb } />
                <Text style={ styles.legend }>{ this.props.value } min</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        width: 50,
    },
    thumb: {
        height: 10,
        width: 10,
        backgroundColor: 'white',
        borderColor: palette.grey,
        borderWidth: 0.32,
        borderRadius: 5
    },
    legend: {
        position: 'absolute',
        bottom: 15,
        color: palette.grey
    }
})
