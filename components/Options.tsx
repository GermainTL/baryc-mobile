import React, { Component } from 'react';
import AdressOption from "~/components/AdressOption.tsx";
import { FlatList, StyleSheet, View } from "react-native";
import palette from "~/constants/Colors.ts" ;

export default class Options extends Component {
        render(): JSX.Element {
                return (
                    <View style={ styles.options }>
                        {
                            this.props.options && this.props.options.map(option => {
                                return (
                                    <AdressOption
                                        option={ option }
                                        selectLocation={ this.props.selectLocation }
                                        locationIndex={ this.props.locationIndex }
                                        key={ option.properties.id }
                                    />
                                )
                            })
                        }
                    </View>
                )
            }
}
const styles = StyleSheet.create({
    options: {
        flex: 1,
        backgroundColor: "white",
        position: "absolute",
        top: 42,
        left: 10,
        right: 10,
        overflow: 'visible',
        borderWidth: 0.5,
        borderColor: palette.grey,
    }
})
