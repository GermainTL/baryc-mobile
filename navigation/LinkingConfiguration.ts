import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Map: {
            screens: {
              TabMapScreen: 'map',
            },
          },
          Bars: {
            screens: {
              TabBarsScreen: 'bars',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
