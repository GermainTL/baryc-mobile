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
  iconShadow: { // Why is it so complicated to have an icon shadow ? Actually I don't know, I just copy/paste from here : https://github.com/oblador/react-native-vector-icons/issues/311
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 0, height: 3
    }
  }
};
