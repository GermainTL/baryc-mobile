import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { Text, View } from '~/components/Themed';
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";

export default function TabOneScreen()  {
  const [bars, setBars] = React.useState([{}])
  useEffect(() => {
    getBarsFromApi().then((data) => setBars(data))
  },[])
    return (
    <View style={styles.container}>
      <FlatList
          data={ bars }
          renderItem={({ item }) => <Text>{ item.nom }</Text>}
          keyExtractor={(item, index: number) => index.toString()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  images:{

    width : 100,
    height : 100,
  }
});
