import {StyleSheet} from 'react-native';

import {screenBackgroundColor} from '../../../config/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: screenBackgroundColor,
    position: 'relative', // for drawer
  },
  homeContainer: {
    flex: 1,
  },
});

export default styles;
