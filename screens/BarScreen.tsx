import * as React from 'react';
import {  View, StyleSheet, Text  } from 'react-native';
// import BarycLoader from '~/components/BarycLoader.tsx'
import { Component } from "react";
import { connect } from "react-redux";

class BarScreen extends Component {
    state = {
        bar: {}
    }

    componentDidMount() {
        this.setState({
            bars: this.props.bars,
            isLoading: false,
        })
    }

    static getDerivedStateFromProps(props, currentState) {
        if (currentState.bars !== props.bars) {
            return {
                bars: props.bars,
            }
        }
        return null
    }

    render(): JSX.Element {
        return (
            <View style={ styles.container }>
            <Text>toto</Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        bars: state.bars
    }
}


export default connect(mapStateToProps)(BarScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
