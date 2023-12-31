import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {PropsWithChildren, ReactNode} from 'react';

import Animated, {
  withTiming,
  withDelay,
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from 'react-native-reanimated';

// DO NOT CHANGE THESE VALUES
// if flat list has at least 1 item (channel screen)
// and in the new render
// it gets more than previous number
// the animation will not execute correcly
// no one knows why
// const delay = 350;
const delay = 0;
const duration = 250;

type ScrollingContainerProps = PropsWithChildren<{
  containerHeight: number;
  dependency: any;
  containerStyle?: any;
  childContainerStyle?: any;
}>;

type ChildContainerProps = PropsWithChildren<{
  containerHeight: number;
  childContainerStyle?: any;
}>;

function ChildContainer({
  children,
  containerHeight,
  childContainerStyle,
}: ChildContainerProps) {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const scrollDown = React.useCallback(() => {
    'worklet';
    translateY.value = withDelay(
      delay,
      withTiming(-containerHeight, {duration: duration}),
    );
  }, [containerHeight, translateY]);

  React.useEffect(() => {
    scrollDown();
    return () => {
      cancelAnimation(translateY);
    };
  }, [scrollDown, translateY]);

  return (
    <Animated.View
      style={[styles.childContainer, childContainerStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function ScrollingContainerComponent({
  children,
  dependency,
  containerHeight,
  containerStyle,
  childContainerStyle,
}: ScrollingContainerProps) {
  // const [prevChildren, setPrevChildren] = React.useState<ReactNode>(<></>);
  const prevChildren = React.useRef<ReactNode>(<></>);

  React.useEffect(() => {
    prevChildren.current = children;
  }, [children, dependency]);

  const keyOffset = React.useRef(0);
  // on every render set new value for key prop
  // so react knows that the two <ChildContaier/> are completely new.
  // so the sharedValue(translateY) will be reset
  keyOffset.current = keyOffset.current === 0 ? 2 : 0;
  const childrenList = [prevChildren.current, children];

  return (
    <View style={[styles.container, containerStyle, {height: containerHeight}]}>
      {childrenList.map((child, index) => (
        <ChildContainer
          key={index + keyOffset.current}
          containerHeight={containerHeight}
          childContainerStyle={childContainerStyle}>
          {child}
        </ChildContainer>
      ))}
    </View>
  );
}

function compareLogic(
  prevProps: ScrollingContainerProps,
  nextProps: ScrollingContainerProps,
) {
  // overwrite the logic for React.memo
  // only rerender if the dependecy prop of the component above has changed
  // ignore other props
  return prevProps.dependency === nextProps.dependency;
}

const ScrollingContainer = React.memo(
  ScrollingContainerComponent,
  compareLogic,
);

export default ScrollingContainer;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    overflow: 'hidden',
  },
  childContainer: {
    // height: '100%',
    // width: '100%',
    flexBasis: '100%',
    // borderWidth: 1,
    borderColor: 'red',
  },
});
