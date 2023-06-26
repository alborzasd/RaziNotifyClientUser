import {configureStore} from '@reduxjs/toolkit';

import dataManagerReducer from './dataManagerSlice';
import authReducer from './authSlice';
import cahnnelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';

interface StoreConfig {
  reducer: any;
  middleware?: any;
}

const config: StoreConfig = {
  reducer: {
    dataManager: dataManagerReducer,
    auth: authReducer,
    channels: cahnnelsReducer,
    messages: messagesReducer,
  },
};

// enalbe redux debugger plugin in flipper
// https://www.npmjs.com/package/redux-flipper
// https://javascript.plainenglish.io/how-to-debug-redux-in-react-native-using-flipper-d785b46cf7bf
// https://redux-toolkit.js.org/api/getDefaultMiddleware
if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  config.middleware = (getDefaultMiddleware: any) => {
    return getDefaultMiddleware().concat(createDebugger());
  };
}

const store = configureStore(config);

export default store;
export type RootState = ReturnType<typeof store.getState>;
