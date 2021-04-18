import * as React from 'react';
import { FlatList, StyleSheet} from 'react-native';

import { Text, View } from '~/components/Themed';
import { Bar } from '~/components/Bar.tsx'
import { useEffect } from "react";
import { getBarsFromApi } from "~/helpers/API/BarsAPI.tsx";

export default function TabBarsScreen() {
  const [bars, setBars] = React.useState([{}])
  useEffect(() => {
    getBarsFromApi().then((data) => setBars(data))
  },[])
  return (
    <View style={styles.container}>
      <FlatList
          data={ bars }
          renderItem={({ item }) => <Bar bar={ item }/>}
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
});
