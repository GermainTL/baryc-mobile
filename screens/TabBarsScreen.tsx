import * as React from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { View } from '~/components/Themed';
import { Bar } from '~/components/Bar.tsx'
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
        <View style={ styles.container }>
           <ActivityIndicator size="large"/>
        </View>
  )
  } else {
    return (
        <View style={ styles.container }>
            <FlatList
              style={ styles.barsList }
              data={ bars }
              renderItem={({ item }) => <Bar bar={ item }/>}
              keyExtractor={(item, index: number) => index.toString()}
              />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 310,
  },
  barsList: {
    paddingTop: 20,
    paddingBottom: 20,
  }
});
