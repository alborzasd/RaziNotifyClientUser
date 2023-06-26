import {StyleSheet} from 'react-native';

import {
  fontFamily,
  primaryColor,
  borderRadius,
  dangerColor,
} from '../../config/styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: 350,
    backgroundColor: '#fff',
    borderRadius: borderRadius,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    textAlign: 'center',
    backgroundColor: primaryColor,
    color: '#fff',
    padding: 10,
  },
  formContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 15,
    gap: 10,
    alignItems: 'center',
  },
  formGroup: {
    gap: 10,
    width: '100%',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  errorText: {
    // borderWidth: 1,
    color: dangerColor,
    fontSize: 13,
    // height: 22,
  },
  buttonPressable: {
    // borderWidth: 1,
    width: '70%',
    marginTop: 20,
  },
  buttonAnimatedView: {
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
    backgroundColor: primaryColor,
  },
  buttonText: {
    // borderWidth: 1,
    textAlign: 'center',
    fontFamily: fontFamily.bold,
    color: '#fff',
  },
});

export default styles;
