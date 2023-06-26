import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const {height, width} = Dimensions.get('window');

interface AnimatedOverlayProps {
  progress: Animated.SharedValue<number>;
}

function AnimatedOverlay({progress}: AnimatedOverlayProps) {
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 0.7], Extrapolate.CLAMP),
    };
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.overlay, overlayAnimatedStyle]}
    />
  );
}

export default AnimatedOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    width,
    backgroundColor: '#333',
    zIndex: 1,
    opacity: 0,
  },
});
