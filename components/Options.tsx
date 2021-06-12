import React, { Component } from 'react';
import AdressOption from "~/components/AdressOption.tsx";
import { FlatList, StyleSheet, SafeAreaView } from "react-native";
import palette from "~/constants/Colors.ts" ;

export default class Options extends Component {
        render(): JSX.Element {
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <FlatList
                            style={ styles.options }
                            data={ this.props.options }
                            keyExtractor={(item, index: number) => index.toString()}
                            renderItem={ (item) =>
                                <AdressOption
                                    option={ item }
                                    selectLocation={ this.props.selectLocation }
                                    locationIndex={ this.props.locationIndex }
                                />
                            }
                        />
                    </SafeAreaView>
                )
            }
}
const styles = StyleSheet.create({
    options: {
        flex: 1,
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        left: 10,
        right: 10,
        overflow: 'visible',
        borderWidth: 0.5,
        borderColor: palette.grey,
    }
})
