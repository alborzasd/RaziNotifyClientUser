/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import styles from './App.styles';

import {Provider} from 'react-redux';
import store from './src/redux/store';

import {SafeAreaView} from 'react-native';

import NavigationContainer from './src/NavigationContainer';

import Toast from './src/components/Toast';

function App(): JSX.Element {
  return (
    <>
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <NavigationContainer />
        </SafeAreaView>
      </Provider>
      <Toast />
    </>
  );
}

export default App;
