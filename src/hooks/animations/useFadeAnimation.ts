import {useRef} from 'react';
import {Animated} from 'react-native';

const fadeInConfigDefault = {
  toValue: 1,
  duration: 100,
  useNativeDriver: true,
};

const fadeOutConfigDefault = {
  toValue: 0.6,
  duration: 100,
  useNativeDriver: true,
};

export default function useFadeAnimation(
  fadeInConfig = fadeInConfigDefault,
  fadeOutConfig = fadeOutConfigDefault,
) {
  const opacityValue = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(opacityValue, fadeInConfig).start();
  };

  const fadeOut = () => {
    Animated.timing(opacityValue, fadeOutConfig).start();
  };

  return {
    opacityValue,
    fadeIn,
    fadeOut,
  };
}
