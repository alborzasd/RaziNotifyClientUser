import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import type {RootState} from './store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {createApiInstanceByToken} from '../config/axios';
import {errorMessages} from '../config/config';

import {hasItem} from '../utilities/array-utilities';

export enum MessagesFetchStatus {
  INIT = 'INIT',
  GET_STORED_MESSAGES = 'GET_STORED_MESSAGES',
  GET_STORED_MESSAGES_FAILED = 'GET_STORED_MESSAGES_FAILED',
  // app is opened for the first time
  GET_STORED_MESSAGES_NULL = 'GET_STORED_MESSAGES_NULL',
  // may be array of MESSAGES is empty,
  // because user is not member of any channel based on last update
  // or all channels he joined is empty
  GET_STORED_MESSAGES_SUCCESS = 'GET_STORED_MESSAGES_SUCCESS',
  FETCH_OLD_MESSAGES = 'FETCH_OLD_MESSAGES',
  FETCH_OLD_MESSAGES_SUCCESS = 'FETCH_OLD_MESSAGES_SUCCESS',
  FETCH_OLD_MESSAGES_FAILED = 'FETCH_OLD_MESSAGES_FAILED',
}

const messagesAdapter = createEntityAdapter({
  selectId: (message: any) => message._id,
  sortComparer: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
});

interface MessageInitialState {
  fetchStatus: MessagesFetchStatus;
  error: any | null;
}

const initialState = messagesAdapter.getInitialState<MessageInitialState>({
  fetchStatus: MessagesFetchStatus.INIT,
  error: null,
});

export const getStoredMessages = createAsyncThunk(
  'messages/getStoredMessages',
  async (_, {rejectWithValue}) => {
    try {
      let storedMessagesStr = await AsyncStorage.getItem('messages');
      return storedMessagesStr ? JSON.parse(storedMessagesStr) : null;
    } catch (err: any) {
      // console.log(err);
      return rejectWithValue({
        message: errorMessages.localStorageError + ' (پیام ها)',
        detail: err?.message,
      });
    }
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    syncMessages(state, action) {
      if (action.payload) {
        // const {added, edited} =
      }
    },
    resetMessagesToNewData(state, action) {
      if (action?.payload?.added) {
        messagesAdapter.setAll(state, action?.payload?.added);
      } else {
        messagesAdapter.removeAll(state);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getStoredMessages.pending, state => {
        state.fetchStatus = MessagesFetchStatus.GET_STORED_MESSAGES;
      })
      .addCase(getStoredMessages.fulfilled, (state, action) => {
        const storedMessages = action.payload;
        if (storedMessages) {
          state.fetchStatus = MessagesFetchStatus.GET_STORED_MESSAGES_SUCCESS;
          messagesAdapter.setAll(state, storedMessages);
        } else {
          state.fetchStatus = MessagesFetchStatus.GET_STORED_MESSAGES_NULL;
        }
        state.error = null;
      })
      .addCase(getStoredMessages.rejected, (state, action) => {
        state.fetchStatus = MessagesFetchStatus.GET_STORED_MESSAGES_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export const {syncMessages, resetMessagesToNewData} = messagesSlice.actions;

export default messagesSlice.reducer;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
} = messagesAdapter.getSelectors((state: RootState) => state.messages);

export const selectMessagesFetchStatus = (state: RootState) =>
  state.messages.fetchStatus;

export const selectMessagesError = (state: RootState) => state.messages.error;

// export const selectMessageIdsByChannelIdAsObject = createSelector();

export const selectMessagesByChannelId = createSelector(
  (state, channelId) => channelId,
  selectAllMessages,
  (channelId, messages: any) =>
    messages.filter((msg: any) => msg.channel_id === channelId),
);

export const selectLastMessageByChannelId = createSelector(
  selectMessagesByChannelId,
  channelMessages => channelMessages?.[channelMessages?.length - 1],
);


// TODO: remove test
// export const selectMessagesByChannelId = createSelector(
//   (state, channelId) => channelId,
//   selectAllMessages,
//   (channelId, messages: any) => {
//     // console.log('channelId', channelId);
//     // console.log('messages', messages);
//     return messages.filter((msg: any) => msg.channel_id === channelId);
//   },
// );
// export const selectLastMessageByChannelId = createSelector(
//   selectMessagesByChannelId,
//   channelMessages => {
//     return channelMessages?.[channelMessages?.length - 1];
//   },
// );
