import * as React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, SafeAreaView, View } from 'react-native';
import { Bar } from '~/components/Bar.tsx'
import BarycLoader from '~/components/BarycLoader.tsx'
import { Component } from "react";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";

export default class TabBarsScreen extends Component {
  state = {
    bars: [],
    isLoading: true
  }

  componentDidMount() {
    getBarsFromApi().then((bars) => {
      this.setState({
        bars: bars,
        isLoading: false,
      })
    })
  }

  render(): JSX.Element {
    return (
    <SafeAreaView
        style={styles.safeAreaViewContainer}
    >
      <BarycLoader
          visible={ this.state.isLoading }
          containerStyle={ styles.loaderContainer }
          type={ 'flowing' }
      />
      {
        !this.state.isLoading && (
          <FlatList
          data={ this.state.bars }
          renderItem={({item}) => <Bar bar={ item }/>}
          keyExtractor={(item, index: number) => index.toString()}
          />
        )
      }
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '33%',
    zIndex: 1000,
  },
  safeAreaViewContainer: {
    marginBottom: 10,
    height: "100%"
  },
});
