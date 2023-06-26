/**
 * @format
 */
// This import MUST BE AT TOP // https://reactnavigation.org/docs/stack-navigator
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {I18nManager} from 'react-native';

// remember: has effect only after first run (after install or clear data in android settings)
I18nManager.forceRTL(true);

AppRegistry.registerComponent(appName, () => App);
