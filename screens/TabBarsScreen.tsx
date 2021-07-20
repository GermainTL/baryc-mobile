import * as React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, SafeAreaView, View } from 'react-native';
import Bar from '~/components/Bar.tsx'
import BarycLoader from '~/components/BarycLoader.tsx'
import { Component } from "react";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";
import { connect } from "react-redux";

class TabBarsScreen extends Component {
  state = {
    bars: [],
    isLoading: true
  }

  componentDidMount() {
    if (this.props.bars === null) {
      getBarsFromApi().then((bars) => {
        this.setState({
          bars: bars,
          isLoading: false,
        })
      })
    } else {
      this.setState({
        bars: this.props.bars,
        isLoading: false,
      })
    }
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
          renderItem={({item}) => <Bar bar={ item } navigation={ this.props.navigation }/>}
          keyExtractor={(item, index: number) => index.toString()}
          />
        )
      }
    </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bars: state.bars
  }
}

export default connect(mapStateToProps)(TabBarsScreen)

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
