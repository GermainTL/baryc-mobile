import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";
import * as React from "react";
import { Component } from "react";

export default class BarycLoader extends Component {
        render(): JSX.Element {
            return (
                <View style={ styles.loaderContainer }>
                    <WebView
                        scalesPageToFit={true}
                        originWhitelist={['*']}
                        domStorageEnabled={ true }
                        source={ require('~/assets/images/rotating-baryc.svg') }
                        style={ styles.loader }
                    />
                </View>
            )
        }
}

const styles = StyleSheet.create({
    loaderContainer: {
        flexDirection: "column",
        height: 100,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    loader: {
        width: 250,
        height: 250,
        backgroundColor: "transparent"
    }
})