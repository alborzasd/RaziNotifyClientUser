import {StyleSheet} from 'react-native';

import {screenBackgroundColor, borderRadius} from '../../config/styles';

const styles = StyleSheet.create({
  container: {
    // if keyboard popsup the container height will shrink
    // and flex: 1 only occupies available space (not window size)
    flex: 1,
    // minHeight: Dimensions.get('window').height,
    backgroundColor: screenBackgroundColor,
    // borderWidth: 3,
  },
  contentContainer: {
    // flex: 1,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    // borderWidth: 3,
    // borderColor: 'red',
  },
  animatedContainer: {
    width: '80%',
  },
  shadowContainer: {
    width: '100%',
  },
  shadowChild: {
    width: '100%',
    borderRadius: borderRadius,
  },
});

export default styles;
