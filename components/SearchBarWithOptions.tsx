import React, { Component } from 'react';
import Options from "~/components/Options.tsx";
import {  StyleSheet, View } from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import palette from "~/constants/Colors.ts" ;

export default class SearchBarWithOptions extends Component {
    render(): JSX.Element {
        return (
            <View style={ this.props.containerStyle }>
                <SearchBar
                    onChangeText={(text) => this.props.handleSearch(text, this.props.locationIndex) }
                    onClear={() => this.props.clearLocation(this.props.locationIndex) }
                    placeholder={ this.props.placeholder }
                    value={ this.props.value }
                    containerStyle={ [styles.searchBar, this.props.isLastSearchBar === true ? styles.lastSearchBar : '' ]}
                    inputContainerStyle={ styles.searchBarContainerInput }
                    inputStyle={ styles.searchBarInput }
                    placeholderTextColor={ this.props.isGPSUsed === true ? palette.orangeLight : '#86939e' }
                    searchIcon={
                        this.props.isGPSUsed === true ?
                            {
                                name: "locate-outline",
                                type: "ionicon"
                            } : true
                    }
                />
                {
                    this.props.options.length > 0 && (
                            <Options
                                options={ this.props.options }
                                selectLocation={ this.props.selectLocation }
                                locationIndex={ this.props.locationIndex }
                            />
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: palette.grey,
        borderWidth: 1,
        padding: 0,
    },
    lastSearchBar: {
        borderWidth: 0,
        borderBottomColor: "transparent",
    },
    searchBarContainerInput: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        height: 40,
    },
    searchBarInput: {
        fontSize: 14
    },
    inputGPSUsed: {
        color: '#00BFFF',
    }
})