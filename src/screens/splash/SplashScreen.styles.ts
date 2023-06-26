import {StyleSheet} from 'react-native';

import {dangerColor, screenBackgroundColor} from '../../config/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: screenBackgroundColor,
    padding: 5,
  },
  text: {
    textAlign: 'center',
  },
  danger: {
    color: dangerColor,
  },
});

export default styles;
