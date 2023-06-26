import {StyleSheet} from 'react-native';
import {drawerWidth, screenBackgroundColor} from '../../../config/styles';

import {Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: screenBackgroundColor,
    position: 'absolute',
    left: 0, // in RTL, left is right (in soviet also!)
    height,
    width: drawerWidth,
    transform: [
      {translateX: drawerWidth}, // hide drawer to right
    ],
    zIndex: 2,
    elevation: 5,
  },
});

export default styles;
