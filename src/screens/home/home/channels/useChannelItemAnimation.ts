import React from 'react';

import {primaryColor} from '../../../../config/styles';
const Color = require('color');

import {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

const duration = 200;
const transParentPrimaryColor = Color(primaryColor).alpha(0.1).string();

export default function useChannelItemAnimation() {
  const progress = useSharedValue(0);

  const channelItemAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(0, 0, 0, 0)', transParentPrimaryColor],
      ),
    };
  });

  const backgroundFadeIn = React.useCallback(() => {
    'worklet';
    progress.value = withTiming(1, {duration});
  }, [progress]);
  const backgroundFadeOut = React.useCallback(() => {
    'worklet';
    progress.value = withTiming(0, {duration});
  }, [progress]);

  return {
    channelItemAnimatedStyle,
    backgroundFadeIn,
    backgroundFadeOut,
  };
}
