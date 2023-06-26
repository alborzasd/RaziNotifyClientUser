import {StyleSheet} from 'react-native';

import {
  fontFamily,
  primaryColor,
  channelItemHeight,
} from '../../../../config/styles';

const textVerticalGap = 6;
// const colTextMarginBottom = 4;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 10,
    // paddingRight: 15,
    height: channelItemHeight,
    // borderBottomWidth: 1,
    // borderColor: 'rgba(0, 0, 0, 0.3)',
    gap: 3,
  },

  colImage: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  colTextInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  colText: {
    flex: 1,
    justifyContent: 'center',
    gap: textVerticalGap,
  },
  titleContainer: {
    flex: 1,
    // borderWidth: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: fontFamily.demiBold,
    fontSize: 15,
    color: '#333',
  },
  messageContainer: {
    flex: 1,
    // flexBasis: '50%',
    // borderWidth: 1,
  },
  message: {
    fontSize: 13,
    marginTop: 1,
  },

  colInfo: {
    justifyContent: 'center',
    gap: textVerticalGap,
    // marginBottom: colTextMarginBottom,
    paddingRight: 15,
    // borderWidth: 1,
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  time: {
    fontSize: 13,
    // marginTop: 4,
  },
  counterContainer: {
    flex: 1,
    alignItems: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  counterSubContainer: {
    marginTop: 2,
    backgroundColor: primaryColor,
    height: 22,
    minWidth: 22,
    borderRadius: 22,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    // padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 13,
    color: '#fff',
  },
});

export default styles;
