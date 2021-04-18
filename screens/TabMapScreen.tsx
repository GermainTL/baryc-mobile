import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { Text, View } from '~/components/Themed';

export default function TabMapScreen()  {
    return (
    <View style={styles.container}>
      <Text>TODO : Add a map here</Text>
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
