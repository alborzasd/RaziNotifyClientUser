import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';

import {Gesture} from 'react-native-gesture-handler';

import {drawerWidth, drawerDuration} from '../../../config/styles';

type DrawerState = 'open' | 'close';

const drawerAnimationConfig = {
  duration: drawerDuration,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

function useDrawerAnimation() {
  const drawerState = useSharedValue<DrawerState>('close');
  const touchTranslateX = useSharedValue(0);
  const drawerProgress = useDerivedValue(() =>
    interpolate(
      touchTranslateX.value,
      drawerState.value === 'close' ? [-drawerWidth, 0] : [0, drawerWidth],
      [1, 0], // 0: fully closed, 1: fully opened
      Extrapolate.CLAMP,
    ),
  );

  // the open/close functions simulate user's finger movement
  // by changing the 'touchTranslateX'
  const openDrawer = () => {
    'worklet';
    // console.log('open');
    const destination = -drawerWidth;
    touchTranslateX.value = withTiming(
      destination,
      drawerAnimationConfig,
      () => {
        'worklet';
        drawerState.value = 'open';
      },
    );
  };
  const closeDrawer = () => {
    'worklet';
    // console.log('close');
    const destination = drawerWidth;
    touchTranslateX.value = withTiming(
      destination,
      drawerAnimationConfig,
      () => {
        'worklet';
        drawerState.value = 'close';
      },
    );
  };
  const openDrawerWithButtonConfig = () => {
    'worklet';
    const destination = -drawerWidth;
    touchTranslateX.value = withTiming(destination, {duration: 300}, () => {
      'worklet';
      drawerState.value = 'open';
    });
  };
  const resetToCurrentState = () => {
    'worklet';
    // console.log('reset');
    touchTranslateX.value = withTiming(0, drawerAnimationConfig);
  };

  const gesture = Gesture.Pan()
    .minDistance(50) // TODO: minDistanceX
    .onUpdate(e => {
      touchTranslateX.value = e.translationX;
      // console.log(e);
    })
    .onEnd(e => {
      if (e.velocityX > 1000 && drawerState.value === 'open') {
        closeDrawer();
      } else if (e.velocityX < -1000 && drawerState.value === 'close') {
        openDrawer();
      } else if (drawerProgress.value > 1 / 2) {
        if (drawerState.value === 'open') {
          resetToCurrentState();
        } else {
          openDrawer();
        }
      } else {
        if (drawerState.value === 'open') {
          closeDrawer();
        } else {
          resetToCurrentState();
        }
      }
    });

  const drawerAnimatedStyle = useAnimatedStyle<any>(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            drawerProgress.value,
            [0, 1],
            [drawerWidth, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return {
    gesture,
    drawerAnimatedStyle,
    drawerProgress,
    openDrawerWithButtonConfig,
  };
}

export default useDrawerAnimation;
