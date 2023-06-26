import React, {useEffect, useRef} from 'react';
import styles from './LoginScreen.styles';

import {ScrollView} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {Animated, Easing} from 'react-native';

import LoginForm from './LoginForm';

function LoginScreen() {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const verticalOffset = opacity.interpolate({
    inputRange: [0.3, 1],
    outputRange: [200, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="always">
      <Animated.View
        style={[
          styles.animatedContainer,
          {transform: [{translateY: verticalOffset}], opacity: opacity},
        ]}>
        <Shadow
          startColor="rgba(99, 99, 99, 0.2)"
          offset={[0, 2]}
          distance={3}
          containerStyle={styles.shadowContainer}
          style={styles.shadowChild}>
          <LoginForm />
        </Shadow>
      </Animated.View>
    </ScrollView>
  );
}

export default LoginScreen;
