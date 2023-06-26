// this slice is responsible for these:
// manage data fetch state (INIT, get data from storage, syncing, ...)
// gets stored data from local storage (atuh, channels, messages)
// save data to local storage (on app close?)
// send request to /sync endpoint to get modified channels and messages
// disptach some actions of auth, channels, messages

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import type {RootState} from './store';

// import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getStoredUser,
  selectAuthFetchStatus,
  selectAuthAccessToken,
  AuthFetchStatus,
} from './authSlice';
import {
  getStoredChannels,
  selectChannelsFetchStatus,
  ChannelsFetchStatus,
  syncChannels,
} from './channelsSlice';
import {
  getStoredMessages,
  selectMessagesFetchStatus,
  MessagesFetchStatus,
  syncMessages,
} from './messagesSlice';

import {createApiInstanceByToken} from '../config/axios';
import {errorMessages} from '../config/config';

export enum DataManagerStatus {
  INIT = 'INIT',
  GET_STORED_DATA = 'GET_STORED_DATA',
  // one of async thunk actions (getStoredUser, getStoredChannels, getStoredMessages)
  // is failed
  GET_STORED_DATA_FAILED = 'GET_STORED_DATA_FAILED',
  // async storage fetch was done but there is no data (no channles, no messages)
  // becuase the app is opened for the first time
  // or user cleared app data before
  // in this case we clear all data except auth (if exist)
  // -> authStatus = LOGGED_OUT, or
  // -> channelsFetchStatus = GET_STORED_CHANNELS_NULL, or
  // -> messagesFetchStatus = GET_STORED_MESSAGES_NULL
  GET_STORED_DATA_NULL = 'GET_STORED_DATA_NULL',
  // the data saved from last updated is fetched
  // (auth exists, channels may be empty[], messages may be empty[])
  // -> authStatus = LOGGED_IN, {} and
  // -> channelsFetchStatus = GET_STORED_CHANNELS_SUCCESS, [] and
  // -> messagesFetchStatus = GET_STORED_MESSAGES_SUCCESS [] and
  GET_STORED_DATA_SUCCESS = 'GET_STORED_DATA_SUCCESS',
  // user has pressed refresh button or app is automatically started sync with server
  SYNCING_DATA = 'SYNCING_DATA',
  // server or internet error
  SYNCING_DATA_FAILED = 'SYNCING_DATA_FAILED',
  SYNCING_DATA_SUCCESS = 'SYNCING_DATA_SUCCESS',
  // storing fetched channels and messages in local storage
  STORING_DATA = 'STORING_DATA',
  STORING_DATA_FAILED = 'STORING_DATA_FAILED',
  STORING_DATA_SUCCESS = 'STORING_DATA_SUCCESS',
}

interface DataManagerState {
  // the server sends time stamp on each sync
  // this property will be saved on app close
  lastSyncTimestamp: string | null;
  status: DataManagerStatus;
  // error may be come from other slices
  error: any | null;
}

type StoredDataManagerState = {
  lastSyncTimestamp: string | null;
} | null;

const initialState: DataManagerState = {
  lastSyncTimestamp: null,
  status: DataManagerStatus.INIT,
  error: null,
};

export const getStoredData = createAsyncThunk(
  'dataManager/getStoredData',
  async (_, {dispatch, getState, rejectWithValue}) => {
    try {
      // unwrap throws error if .rejected action is dispatched for each async thunk
      await dispatch(getStoredUser()).unwrap();
      await dispatch(getStoredChannels()).unwrap();
      await dispatch(getStoredMessages()).unwrap();

      const storedDataManagerStateStr = await AsyncStorage.getItem(
        'dataManager',
      );
      const storedDataManagerState: StoredDataManagerState =
        storedDataManagerStateStr
          ? JSON.parse(storedDataManagerStateStr)
          : null;

      if (
        selectAuthFetchStatus(getState()) === AuthFetchStatus.LOGGED_IN &&
        selectChannelsFetchStatus(getState()) ===
          ChannelsFetchStatus.GET_STORED_CHANNELS_SUCCESS &&
        selectMessagesFetchStatus(getState()) ===
          MessagesFetchStatus.GET_STORED_MESSAGES_SUCCESS &&
        storedDataManagerState !== null
      ) {
        return storedDataManagerState;
      }

      // at this point we separate auth and other data
      // auth may be LOGGED_OUT or LOGGED_IN
      // one of the dataManager, channels, messages may be null
      // this scenario should not happen, all data must be null together, but in this case
      // we remove all the data (except the separated auth)
      // so now all of them are null
      await AsyncStorage.multiRemove(['dataManager', 'channels', 'messages']);
      return null;
    } catch (err: any) {
      // console.log(err);
      if (err instanceof Error) {
        // error comes from this thunk itself
        throw err;
      } else {
        // error comes from unwrap methods (even if they throw Error in thier thunks)
        // err is action.error (Error object)
        // or action.payload (plain object) of one of async thunks above
        return rejectWithValue(err);
      }
    }
  },
);

export const syncData = createAsyncThunk(
  'dataManager/syncData',
  async (_, {dispatch, getState, rejectWithValue}) => {
    try {
      const accessToken = selectAuthAccessToken(getState());
      const api = createApiInstanceByToken(accessToken);
      const lastSyncTimestamp = selectLastSyncTimestamp(getState());

      const response = await api.get('/sync', {params: {lastSyncTimestamp}});
      // it's an object similar to json patch
      const syncPayload = response.data?.data;

      dispatch(syncChannels(syncPayload?.channels));
      dispatch(syncMessages(syncPayload?.messages));

      return syncPayload?.lastSyncTimestamp;
    } catch (err: any) {
      console.log(err);
      if (err?.response) {
        return rejectWithValue({
          message: `خطای ${err?.response?.status} از سمت سرور`,
          details: [err?.response?.data?.error?.message, err?.message],
        });
      } else if (err?.request) {
        return rejectWithValue({
          message: errorMessages.networkError,
          details: [err?.message],
        });
      } else {
        return rejectWithValue({
          message: errorMessages.internalAppError,
          details: [err?.message],
        });
      }
    }
  },
);

const dataManagerSlice = createSlice({
  name: 'dataManager',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getStoredData
      .addCase(getStoredData.pending, state => {
        state.status = DataManagerStatus.GET_STORED_DATA;
      })
      .addCase(getStoredData.fulfilled, (state, action) => {
        const storedDataManagerState: StoredDataManagerState = action.payload;
        if (storedDataManagerState) {
          state.status = DataManagerStatus.GET_STORED_DATA_SUCCESS;
          state.lastSyncTimestamp = storedDataManagerState.lastSyncTimestamp;
        } else {
          state.status = DataManagerStatus.GET_STORED_DATA_NULL;
        }
        state.error = null;
      })
      .addCase(getStoredData.rejected, (state, action) => {
        state.status = DataManagerStatus.GET_STORED_DATA_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      })
      // syncData
      .addCase(syncData.pending, state => {
        state.status = DataManagerStatus.SYNCING_DATA;
      })
      .addCase(syncData.fulfilled, (state, action) => {
        state.status = DataManagerStatus.SYNCING_DATA_SUCCESS;
        state.lastSyncTimestamp = action.payload;
        state.error = null;
      })
      .addCase(syncData.rejected, (state, action) => {
        state.status = DataManagerStatus.SYNCING_DATA_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

// export const {} = dataManagerSlice.actions;

export default dataManagerSlice.reducer;

export const selectDataManagerStatus = (state: RootState) =>
  state.dataManager.status;

export const selectDataManagerError = (state: RootState) =>
  state.dataManager.error;

export const selectLastSyncTimestamp = (state: RootState) =>
  state.dataManager.lastSyncTimestamp;
