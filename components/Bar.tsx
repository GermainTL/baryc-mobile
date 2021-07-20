import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { Card, Rating } from 'react-native-elements'
import { Component } from 'react';

export default class Bar extends Component {
    render(): JSX.Element {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Bar', {
                barId: this.props.bar.id,
            })
            }>
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
            </TouchableOpacity>
        )
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