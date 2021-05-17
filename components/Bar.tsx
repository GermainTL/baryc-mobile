import { Text, View, StyleSheet } from 'react-native';
import { Card, Rating } from 'react-native-elements'
import React, { Component } from 'react';



export default class Bar extends Component {
    render(): JSX.Element {
        return (
            <Card containerStyle={ styles.card }>
                <View style={ styles.titleContainer }>
                    <Text style={ styles.title }>
                    {
                        this.props.bar.nom
                    }
                    </Text>
                    <Rating fractions={ 1 } readonly imageSize={ 16 } startingValue={ this.props.bar.note }/>
                </View>
                <Text style={ styles.description }>
                    "{
                        this.props.bar.renseignements
                    }"
                </Text>
            </Card>
        );
    }
}



const styles = StyleSheet.create({
    card: {
      padding: 10
    },
    titleContainer: {
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    description: {
        marginTop: 6,
        fontWeight: "300"
    }
})
