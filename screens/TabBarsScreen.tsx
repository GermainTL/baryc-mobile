import * as React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, SafeAreaView, View } from 'react-native';

import { Bar } from '~/components/Bar.tsx'
import BarycLoader from '~/components/BarycLoader.tsx'
import { useEffect } from "react";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";

export default function TabBarsScreen() {
  const [bars, setBars] = React.useState([{}])
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    getBarsFromApi().then((data) => {
      setBars(data)
      setIsLoading(false)
    })
  },[])

  if (isLoading) {
    return (
        <BarycLoader style={ styles.loaderContainer }/>
  )
  } else {
    return (
        <SafeAreaView
          style={ styles.safeAreaViewContainer }
        >
            <FlatList
              data={ bars }
              renderItem={({ item }) => <Bar bar={ item }/>}
              keyExtractor={(item, index: number) => index.toString()}
              />
        </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaViewContainer: {
    marginBottom: 10,
  },
});
