import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, TextInput as Input, Animated} from 'react-native';

import type {PropsWithChildren} from 'react';

import {borderRadius, primaryColor, fontFamily} from '../config/styles';

const Color = require('color');
const duration = 100;

function TextInput(props: PropsWithChildren<any>) {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef();

  const borderWidth = useRef(new Animated.Value(1)).current;
  const padding = borderWidth.interpolate({
    inputRange: [1, 3],
    outputRange: [3, 1],
    extrapolate: 'clamp',
  });
  const borderColor = borderWidth.interpolate({
    inputRange: [1, 3],
    outputRange: ['#bbb', Color(primaryColor).alpha(0.5).string()],
    // outputRange: ['#bbb', primaryColor],
    extrapolate: 'clamp',
  });

  const animatedStyles = {
    borderWidth: borderWidth,
    borderColor: borderColor,
    padding: padding,
  };

  useEffect(() => {
    if (isFocused) {
      Animated.timing(borderWidth, {
        toValue: 3,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(borderWidth, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, borderWidth]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Input
        ref={inputRef}
        cursorColor={Color(primaryColor).alpha(0.8).string()}
        selectionColor={Color(primaryColor).alpha(0.5).string()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
        style={[styles.input, props.style]}
      />
    </Animated.View>
  );
}

export default TextInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius,
    height: 50,
  },
  input: {
    // borderWidth: 1,
    borderRadius: borderRadius,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    height: '100%',
    width: '100%',
    padding: 0,
    paddingHorizontal: 6,
  },
});
