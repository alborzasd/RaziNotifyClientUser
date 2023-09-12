import {StyleSheet} from 'react-native';

import {borderRadius, fontFamily} from '../../../config/styles';

const messageTitleFontSize = 16;
const messageBodyFontSize = 14;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,

    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    // borderRadius: borderRadius - 2,
    borderRadius: 5,

    backgroundColor: '#fff',
  },

  messageTitle: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#ddd',
    paddingBottom: 6,

    fontSize: messageTitleFontSize,
    lineHeight: messageTitleFontSize * 1.8,
    fontFamily: fontFamily.bold,
    color: '#555',
  },

  messageBodyText: {
    fontSize: messageBodyFontSize,
    lineHeight: messageBodyFontSize * 1.8,

    marginBottom: 14,
  },

  messageInfoContainer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,

    backgroundColor: 'rgb(245, 245, 251)',
    paddingHorizontal: 8,
    paddingVertical: 8,

    // minHeight: 40,
    borderRadius: borderRadius,
    // borderWidth: 1,
    // borderColor: 'red',
  },

  messageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  messageInfoText: {
    fontSize: 13,
  },
});

export default styles;
