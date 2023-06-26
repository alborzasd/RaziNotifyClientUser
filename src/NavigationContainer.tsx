import React, {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {AuthFetchStatus, selectAuthFetchStatus} from './redux/authSlice';

import {
  getStoredData,
  selectDataManagerStatus,
  DataManagerStatus,
} from './redux/dataManagerSlice';

import {NavigationContainer as Nav} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './screens/splash/SplashScreen';
import HomeScreenNavigator from '../src/screens/home/HomeScreenNavigator';
import LoginScreen from '../src/screens/login/LoginScreen';

import {primaryColor} from './config/styles';

const Stack = createNativeStackNavigator();

function NavigationContainer() {
  const dispatch = useDispatch<any>();

  const dataManagerStatus = useSelector(selectDataManagerStatus);
  const authFetchStatus = useSelector(selectAuthFetchStatus);

  useEffect(() => {
    if (dataManagerStatus === DataManagerStatus.INIT) {
      dispatch(getStoredData());
    }
  }, [dispatch, dataManagerStatus]);

  let screenToRender;
  if (
    dataManagerStatus === DataManagerStatus.INIT ||
    dataManagerStatus === DataManagerStatus.GET_STORED_DATA ||
    dataManagerStatus === DataManagerStatus.GET_STORED_DATA_FAILED
  ) {
    screenToRender = <Stack.Screen name="Splash" component={SplashScreen} />;
  } else if (
    authFetchStatus === AuthFetchStatus.LOGGED_OUT ||
    authFetchStatus === AuthFetchStatus.SENDING_CREDENTIALS ||
    authFetchStatus === AuthFetchStatus.AUTH_FAILED
  ) {
    screenToRender = <Stack.Screen name="Login" component={LoginScreen} />;
  } else if (authFetchStatus === AuthFetchStatus.LOGGED_IN) {
    screenToRender = (
      <Stack.Screen name="HomeNavigator" component={HomeScreenNavigator} />
    );
  }

  return (
    <Nav>
      <Stack.Navigator
        initialRouteName="HomeNavigator"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          statusBarColor: primaryColor,
          statusBarAnimation: 'fade',
        }}>
        {screenToRender}
      </Stack.Navigator>
    </Nav>
  );
}

export default NavigationContainer;
