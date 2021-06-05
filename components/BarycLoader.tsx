import { WebView } from "react-native-webview";
import { StyleSheet, View, Animated } from "react-native";
import * as React from "react";
import { Component } from "react";

export const svgSource = {
    'rotating': require('~/assets/images/rotating-baryc.svg'),
    'flowing': require('~/assets/images/flowing-baryc.svg')
}

export default class BarycLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            opacity: new Animated.Value(props.visible ? 1 : 0),
            useNativeDriver: true
        };
    };

    static getDerivedStateFromProps(props, state) {
        Animated.timing(state.opacity, {
            toValue: props.visible ? 1 : 0,
            duration: 1000,
            useNativeDriver: true
        }).start();

        return null
    }

    render(): JSX.Element {
        const animatedStyle = {
            opacity: this.state.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
            zIndex: this.state.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            })
        };

        const combinedStyle = [this.props.containerStyle, animatedStyle];
        return (
            <Animated.View style={ this.state.visible ? combinedStyle : this.props.containerStyle }>
                <View style={ styles.loaderContainer }>
                    <WebView
                        scalesPageToFit={true}
                        originWhitelist={['*']}
                        domStorageEnabled={ true }
                        source={ svgSource[this.props.type] }
                        style={ styles.loader }
                    />
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    loaderContainer: {
        alignSelf: 'center',
        flexDirection: "column",
        height: 120,
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