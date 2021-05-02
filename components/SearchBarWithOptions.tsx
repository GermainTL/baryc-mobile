import React, { Component } from 'react';
import Options from "~/components/Options.tsx";
import {  StyleSheet, View } from "react-native";
import { SearchBar} from "react-native-elements";
import palette from "~/constants/Colors.ts";

export default class SearchBarWithOptions extends Component {
    render(): JSX.Element {
        return (
            <View style={ this.props.containerStyle }>
                <SearchBar
                    onChangeText={(text) => this.props.handleSearch(text, this.props.locationIndex) }
                    onClear={() => this.props.clearLocation(this.props.locationIndex) }
                    placeholder={ this.props.placeholder }
                    value={ this.props.value }
                    lightTheme
                    containerStyle={ styles.searchBar }
                />
                <View>
                    <Options
                        options={ this.props.options }
                        selectLocation={ this.props.selectLocation }
                        locationIndex={ this.props.locationIndex }
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: "white",
        borderTopColor: "white",
        borderBottomColor: "white",
    }
})