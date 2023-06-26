import React from 'react';

import {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

export default function useTopbarAnimation() {
  const topbarTranslateY = useSharedValue(-50);

  const topbarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: topbarTranslateY.value}],
  }));

  const runAnimation = React.useCallback(() => {
    'worklet';
    topbarTranslateY.value = withTiming(0, {duration: 300});
  }, [topbarTranslateY]);

  return {
    topbarAnimatedStyle,
    runAnimation,
  };
}
