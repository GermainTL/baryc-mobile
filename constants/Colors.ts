const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  orange: '#bf360c',
  orangeLight: '#f9683a',
  orangeDark: '#870000',
  grey: '#C4C4C4',
  greyDark: '#656565',
  iconShadow: {
    // Why is it so complicated to have an icon shadow ? Actually I don't know, I just copy/paste from here : https://github.com/oblador/react-native-vector-icons/issues/311
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  polygonColors: [
    {
      fillColor: 'rgba(106, 183, 255, 0.16)',
      strokeColor: 'rgba(30, 136, 229, 0.5)',
      userIconColor: 'rgb(30, 136, 229)',
    },
    {
      fillColor: 'rgba(249, 104, 58, 0.16)',
      strokeColor: 'rgba(191, 54, 12, 0.5)',
      userIconColor: 'rgb(191, 54, 12)',
    },
    {
      fillColor: 'rgba(128, 226, 126, 0.16)',
      strokeColor: 'rgba(76, 175, 80, 0.5)',
      userIconColor: 'rgb(76, 175, 80)',
    },
    {
      fillColor: 'rgba(255, 255, 114, 0.16)',
      strokeColor: 'rgba(255, 235, 59, 0.5)',
      userIconColor: 'rgb(255, 235, 59)',
    },
  ],
};
