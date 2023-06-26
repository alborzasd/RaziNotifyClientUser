import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import {fontFamily, fontSize} from '../config/styles';

import type {PropsWithChildren} from 'react';

export default function Text(props: PropsWithChildren<any>) {
  return (
    <RNText {...props} style={[styles.text, props.style]}>
      {props.children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#666',
    fontFamily: fontFamily.regular,
    fontSize,
  },
});
