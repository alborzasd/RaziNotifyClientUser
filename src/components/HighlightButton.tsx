import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import type {PropsWithChildren} from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

type HighlightButtonProps = PropsWithChildren<{
  onPress: (event: any) => any;
  disabled?: boolean;
  containerStyle?: any;
}>;

function HighlightButton({
  children,
  onPress,
  disabled,
  containerStyle,
}: HighlightButtonProps) {
  const progress = useSharedValue(0);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 0.3], Extrapolate.CLAMP),
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [1, 1.3],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const handlePressIn = () => {
    'worklet';
    progress.value = withTiming(1, {duration: 50});
  };
  const handlePressOut = () => {
    'worklet';
    progress.value = withTiming(0, {duration: 50});
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.overlay, overlayAnimatedStyle]}
      />
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={30}
        disabled={disabled}>
        {children}
      </Pressable>
    </View>
  );
}

export default HighlightButton;

const styles = StyleSheet.create({
  container: {
    // height: 24,
    // width: 24,
    // borderWidth: 1,
    // padding: 2,
    borderRadius: 4,
    position: 'relative',
    // overflow: 'visible',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    // width: '100%',
    // height: '100%',
    borderRadius: 4,
    backgroundColor: '#fff',
    opacity: 0.5,
  },
});
