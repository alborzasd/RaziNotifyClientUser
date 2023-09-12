import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import type {RootState} from './store';

import AsyncStorage from '@react-native-async-storage/async-storage';

// import {createApiInstanceByToken} from '../config/axios';
import {errorMessages} from '../config/config';

import {hasItem} from '../utilities/array-utilities';

export enum ChannelsFetchStatus {
  INIT = 'INIT',
  GET_STORED_CHANNELS = 'GET_STORED_CHANNELS',
  GET_STORED_CHANNELS_FAILED = 'GET_STORED_CHANNELS_FAILED',
  // app is opened for the first time
  GET_STORED_CHANNELS_NULL = 'GET_STORED_CHANNELS_NULL',
  // may be array of channels is empty,
  // because user is not member of any channel based on last update
  GET_STORED_CHANNELS_SUCCESS = 'GET_STORED_CHANNELS_SUCCESS',
}

const channelsAdapter = createEntityAdapter({
  selectId: (channel: any) => channel?._id,
});

interface ChannelInitialState {
  fetchStatus: ChannelsFetchStatus;
  error: any | null;
}

const initialState = channelsAdapter.getInitialState<ChannelInitialState>({
  fetchStatus: ChannelsFetchStatus.INIT,
  error: null,
});

export const getStoredChannels = createAsyncThunk(
  'channels/getStoredChannels',
  async (_, {rejectWithValue}) => {
    try {
      let storedChannelsStr = await AsyncStorage.getItem('channels');
      return storedChannelsStr ? JSON.parse(storedChannelsStr) : null;
    } catch (err: any) {
      // console.log(err);
      return rejectWithValue({
        message: errorMessages.localStorageError + ' (کانال ها)',
        detail: err?.message,
      });
    }
  },
);

// export const fetchChannels = createAsyncThunk(
//   'channels/fetchChannels',
//   async (_, {getState, rejectWithValue}: any) => {
//     try {
//       const accessToken = getState()?.auth?.accessToken;
//       const api = createApiInstanceByToken(accessToken);
//       const response = await api.get('/channels');
//       console.log(response);
//       return response.data?.data;
//     } catch (err: any) {
//       console.log(err);
//       if (err?.response) {
//         return rejectWithValue({
//           message: `خطای ${err?.response?.status} از سمت سرور`,
//           detail: err?.response?.data?.error?.message,
//         });
//       } else if (err?.request) {
//         return rejectWithValue({
//           message: errorMessages.networkError,
//           detail: err?.message,
//         });
//       } else {
//         return rejectWithValue({
//           message: errorMessages.internalAppError,
//           detail: err?.message,
//         });
//       }
//     }
//   },
// );

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    syncChannels(state, action) {
      if (action.payload) {
        const {
          added,
          edited,
          existingIds: responseIds,
          isAnyMembershipDeleted,
        } = action.payload;

        // we should not check if responseIds has item or not
        // if all channels are deleted then this array is empty
        // so the compareAndDelete will not run
        // we need an explicit condition for that
        isAnyMembershipDeleted === true &&
          compareAndDelete(channelsAdapter, state, responseIds);

        // add new channels
        // merge updated values if id exist
        // if use addMany we would see a bug:
        //  if a membership deleted from server, then channel edited
        //  then membership added again, we can not see updated values of channel
        hasItem(added) && channelsAdapter.upsertMany(state, added);

        // we dont want to use setMany,
        // becuase we want to ignore update for id that does not exist
        // for example a message from long time ago that is edited now
        // but it's not fetched by user
        // if we use setMany, that message will be added!
        hasItem(edited) &&
          channelsAdapter.updateMany(
            state,
            edited.map((entity: any) => ({id: entity._id, changes: entity})),
          );
      }
    },
    resetChannelsToNewData(state, action) {
      if (action?.payload?.added) {
        channelsAdapter.setAll(state, action?.payload?.added);
      } else {
        channelsAdapter.removeAll(state);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getStoredChannels.pending, state => {
        state.fetchStatus = ChannelsFetchStatus.GET_STORED_CHANNELS;
      })
      .addCase(getStoredChannels.fulfilled, (state, action) => {
        const storedChannels = action.payload;
        if (storedChannels) {
          state.fetchStatus = ChannelsFetchStatus.GET_STORED_CHANNELS_SUCCESS;
          channelsAdapter.setAll(state, storedChannels);
        } else {
          state.fetchStatus = ChannelsFetchStatus.GET_STORED_CHANNELS_NULL;
        }
        state.error = null;
      })
      .addCase(getStoredChannels.rejected, (state, action) => {
        state.fetchStatus = ChannelsFetchStatus.GET_STORED_CHANNELS_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
    // .addCase(fetchChannels.pending, state => {
    //   state.fetchStatus = ChannelsFetchStatus.SYNCING;
    // })
    // .addCase(fetchChannels.fulfilled, (state, action) => {
    //   state.fetchStatus = ChannelsFetchStatus.SUCCESS;
    //   channelsAdapter.setAll(state, action.payload);
    // })
    // .addCase(fetchChannels.rejected, (state, action) => {
    //   state.fetchStatus = ChannelsFetchStatus.FAILED;
    //   if (action.payload) {
    //     state.error = action.payload;
    //   } else {
    //     state.error = action.error;
    //   }
    // });
  },
});

export const {syncChannels, resetChannelsToNewData} = channelsSlice.actions;

export default channelsSlice.reducer;

export const {
  selectAll: selectAllChannels,
  selectById: selectChannelById,
  selectIds: selectChannelIds,
} = channelsAdapter.getSelectors((state: RootState) => state.channels);

export const selectChannelsFetchStatus = (state: RootState) =>
  state.channels.fetchStatus;

export const selectChannelsError = (state: RootState) => state.channels.error;

export const selectChannelIdsAsObject = createSelector(
  selectChannelIds,
  channelIds => channelIds.map(id => ({id})),
);

export const selectChannelsCount = createSelector(
  selectChannelIds,
  channelIds => channelIds?.length,
);

export const selectSortedChannels = createSelector(
  selectAllChannels,
  channels =>
    channels.sort((a: any, b: any) => {
      const isoDateA = a?.der_lastMessage?.createdAt || a?.createdAt;
      const isoDateB = b?.der_lastMessage?.createdAt || b?.createdAt;
      return isoDateB.localeCompare(isoDateA);
    }),
);

// adapter helper
/**
 * compare existing channelIds with server response channelIds
 * remove channels that Ids of them are not in the response array
 *
 * the state passed here is not RootState
 * because this function is called inside a reducer
 * so we can not use entity adapter selector to get current Ids array
 */
function compareAndDelete(entityAdapter: any, state: any, responseIds: any) {
  const responseIdsArray = responseIds.map(({_id}: any) => _id);
  const existingChannelIdsArray = state?.ids || [];

  const deletingIds = existingChannelIdsArray.filter(
    (existingId: any) => !responseIdsArray.includes(existingId),
  );
  // console.log('deleting', deletingIds);

  entityAdapter?.removeMany(state, deletingIds);
}
