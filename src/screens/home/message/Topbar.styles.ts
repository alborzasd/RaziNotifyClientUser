import {StyleSheet} from 'react-native';

import {
  primaryColor,
  topBarHeight,
  fontFamily,
  topbarButtonSize,
} from '../../../config/styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: topBarHeight,
    backgroundColor: primaryColor,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },

  highlightButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    width: topbarButtonSize + 4,
    height: topbarButtonSize + 4,
  },
});

export default styles;
