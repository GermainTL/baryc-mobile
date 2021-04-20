import { Text, View, StyleSheet } from 'react-native';
import * as React from 'react';
import { Card, Rating } from 'react-native-elements'

interface Props {
    bar: Object;
}

export function Bar(props: Props) {
    return (
            <Card containerStyle={ styles.card }>
                <View style={ styles.titleContainer }>
                    <Text style={ styles.title }>
                    {
                        props.bar.nom
                    }
                    </Text>
                    <Rating fractions={ 1 } readonly imageSize={ 16 } startingValue={ props.bar.note }/>
                </View>
                <Text style={ styles.description }>
                    "{
                        props.bar.renseignements
                    }"
                </Text>
            </Card>
    )
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