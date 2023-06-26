import React from 'react';
import styles from './HomeScreen.styles';

import {View} from 'react-native';
import Drawer from './Drawer';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import useDrawerAnimation from './useDrawerAnimarion';
import AnimatedOverlay from './AnimatedOverlay';
import Topbar from './Topbar';
import ChannelList from './channels/ChannelList';

function HomeScreen() {
  const {
    gesture,
    drawerAnimatedStyle,
    drawerProgress,
    openDrawerWithButtonConfig,
  } = useDrawerAnimation();

  const homeScreenAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            drawerProgress.value,
            [0, 1],
            [0, -40],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <AnimatedOverlay progress={drawerProgress} />
        <Drawer animatedStyle={drawerAnimatedStyle} />
        <Animated.View style={[styles.homeContainer, homeScreenAnimatedStyle]}>
          <Topbar handleMenuButton={openDrawerWithButtonConfig} />
          <ChannelList />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

export default HomeScreen;
