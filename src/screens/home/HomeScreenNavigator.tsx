import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeScreen from './home/HomeScreen';
import MessageScreen from './message/MessageScreen';

import {Dimensions} from 'react-native';

const Stack = createStackNavigator();

// console.log(TransitionPresets.SlideFromRightIOS);

function HomeScreenNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{
          gestureEnabled: true, // we will implement default gesture handler
          // gestureDirection: 'horizontal',
          gestureResponseDistance: Dimensions.get('window').width,
          // transitionSpec: {
          //   open: TransitionSpecs.TransitionIOSSpec,
          //   close: TransitionSpecs.TransitionIOSSpec,
          // },
          ...TransitionPresets.SlideFromRightIOS, // style interpolator has no effect
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeScreenNavigator;
