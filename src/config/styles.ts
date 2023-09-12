import {Dimensions} from 'react-native';

export const fontFamily = {
  black: 'IRANSansX-Black',
  bold: 'IRANSansX-Bold',
  demiBold: 'IRANSansX-DemiBold',
  extraBold: 'IRANSansX-ExtraBold',
  light: 'IRANSansX-Light',
  medium: 'IRANSansX-Medium',
  regular: 'IRANSansX-Regular',
  thin: 'IRANSansX-Thin',
  ultraLight: 'IRANSansX-UltraLight',
};
export const fontSize = 16;

export const primaryColor = '#8F43EE';
export const secondaryColor = '#6C9BCF';
export const successColor = '#03C988';
export const warningColor = '#F2CD5C';
export const dangerColor = '#F16767';

export const screenBackgroundColor = 'rgb(245, 245, 251)';

export const borderRadius = 7;

export const toastDuration = 4000; // ms
export const drawerDuration = 140;

// export const drawerWidthPercent = 0.7;
const {width: windowWidth} = Dimensions.get('window');
export const drawerWidth = 0.7 * windowWidth;

export const topBarHeight = 60;
export const channelItemHeight = 80;
export const messageItemMinHeight = 120;

export const topbarButtonSize = 28;

// https://stackoverflow.com/questions
// -/48422897/react-native-set-text-direction-to-rtl-non-automatic/68284174#68284174
// insert these characters before a text to forece them render as rtl or ltr
export const rtlMark = '\u200F';
export const ltrMark = '\u200E';
