import {StyleSheet} from 'react-native';

import {primaryColor, fontFamily, topBarHeight} from '../../../config/styles';

export const buttonSize = 28;

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
  },
  titleChildContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue',
  },
  title: {
    // flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },
  highlightButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    width: buttonSize + 4,
    height: buttonSize + 4,
  },
});

export default styles;
