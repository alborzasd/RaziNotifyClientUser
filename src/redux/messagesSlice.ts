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

import {selectAuthAccessToken} from './authSlice';

import {hasItem} from '../utilities/array-utilities';
import {handleAsyncThunkAxiosError} from './utilities';

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
  FETCH_NEW_MESSAGES = 'FETCH_NEW_MESSAGES',
  FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS',
  FETCH_MESSAGES_FAILED = 'FETCH_MESSAGES_FAILED',
}

const messagesAdapter = createEntityAdapter({
  selectId: (message: any) => message?._id,
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

export const fetchMessagesOfChannel = createAsyncThunk<any, any>(
  'messages/fetchMessagesOfChannel',
  async (
    {channelId, after, before, stateTransition},
    {getState, rejectWithValue},
  ) => {
    // with stateTransition the extra reducers can decide
    // move to FETCH_OLD_MESSAGES or FETCH_NEW_MESSAGES state
    try {
      const accessToken = selectAuthAccessToken(getState());
      const api = createApiInstanceByToken(accessToken);

      const response = await api.get(`/sync/${channelId}`, {
        params: {after, before},
      });

      // TODO: remove log
      // console.log('response', response?.data);

      // response from server => '{data: {messages: [...], limit: number}}'
      return {data: response?.data?.data, stateTransition};
    } catch (err: any) {
      // TODO: remove log
      // console.log('err', err?.response?.data);
      return handleAsyncThunkAxiosError(err, rejectWithValue);
    }
  },
);

export const syncLastMessageVisited = createAsyncThunk<any, any>(
  'messages/syncLastMessageVisited',
  async ({channelId, messageId}, {getState, rejectWithValue}) => {
    try {
      const accessToken = selectAuthAccessToken(getState());
      const api = createApiInstanceByToken(accessToken);

      const response = await api.patch(
        `/sync/${channelId}/lastMessageVisited`,
        {
          messageId,
        },
      );

      return response?.data?.data;
    } catch (err: any) {
      return handleAsyncThunkAxiosError(err, rejectWithValue);
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
      // get stored messages
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
      })
      // fetch messages of channel
      .addCase(fetchMessagesOfChannel.pending, (state, action) => {
        if (action?.meta?.arg?.stateTransition === 'FETCH_NEW') {
          state.fetchStatus = MessagesFetchStatus.FETCH_NEW_MESSAGES;
        } else {
          state.fetchStatus = MessagesFetchStatus.FETCH_OLD_MESSAGES;
        }
      })
      .addCase(fetchMessagesOfChannel.fulfilled, (state, action) => {
        state.fetchStatus = MessagesFetchStatus.FETCH_MESSAGES_SUCCESS;
        state.error = null;
        const messages = action?.payload?.data?.messages;
        messagesAdapter.upsertMany(state, messages);
      })
      .addCase(fetchMessagesOfChannel.rejected, (state, action) => {
        state.fetchStatus = MessagesFetchStatus.FETCH_MESSAGES_FAILED;
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

export const selectFirstMessageOfChannel = createSelector(
  selectMessagesByChannelId,
  messagesOfChannel => messagesOfChannel?.[0],
);

// export const selectLastMessageByChannelId = createSelector(
//   selectMessagesByChannelId,
//   channelMessages => channelMessages?.[channelMessages?.length - 1],
// );

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
