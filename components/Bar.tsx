import { Text, View, StyleSheet } from 'react-native';
import * as React from 'react';

export interface Props {
    bar: Object;
}

export function Bar(props: Props) {
    return (
        <View style={styles.container}>
         <Text style={styles.title}>{ props.bar.nom }</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 180,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})