import * as React from 'react';
import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import axios from "axios";

export default function TabOneScreen() {
  let path = "/bars";
  var url =
      "https://f3n48sbbli.execute-api.eu-west-1.amazonaws.com/v1" + path;
  let bars: any[] = [];
  axios.get(url).then(response => {
    bars = JSON.parse(response.data.body)
  })
  console.log(bars)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Baryc ! :)</Text>
      <Text>{ bars[0].nom }</Text>
      <Image style={styles.images} source={require("../assets/images/beer.png")}/>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
