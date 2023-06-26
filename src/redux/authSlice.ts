import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';

import {api} from '../config/axios';
import {errorMessages} from '../config/config';
import {RootState} from './store';

// import {AnyAction} from '@reduxjs/toolkit';

export enum AuthFetchStatus {
  INIT = 'INIT',
  GET_STORED_USER = 'GET_STORED_USER',
  GET_STORED_USER_FAILED = 'GET_STORED_USER_FAILED',
  LOGGED_OUT = 'LOGGED_OUT',
  SENDING_CREDENTIALS = 'SENDING_CREDENTIALS',
  LOGGED_IN = 'LOGGED_IN',
  AUTH_FAILED = 'AUTH_FAILED',
}

interface AuthState {
  userInfo: any | null;
  status: AuthFetchStatus;
  error: any | null;
  accessToken: string | null;
}

type StoredUser = {
  userInfo: any;
  accessToken: any;
} | null;

const initialState: AuthState = {
  userInfo: null,
  status: AuthFetchStatus.INIT,
  error: null,
  accessToken: null,
};

export const getStoredUser = createAsyncThunk<any>(
  'auth/getStoredUser',
  async () => {
    try {
      let storedUserStr = await EncryptedStorage.getItem('user');
      let storedUser: StoredUser = null;
      if (storedUserStr) {
        storedUser = JSON.parse(storedUserStr);
      }
      return storedUser;
    } catch (err: any) {
      // console.log(err);
      const message = `خطا در برقراری ارتباط با حافظه داخلی دستگاه \n\tDetails: ${err?.message}`;
      throw new Error(message);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({username, password}: any, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      // console.log(response);

      // storing user in storage
      const storingUser: StoredUser = {userInfo: null, accessToken: null};
      storingUser.userInfo = response.data?.data?.user;
      storingUser.accessToken = response.data?.data?.accessToken;
      const storingUserStr = JSON.stringify(storingUser);
      await EncryptedStorage.setItem('user', storingUserStr);

      return response.data?.data;
    } catch (err: any) {
      // console.log(err);
      if (err?.response) {
        if (err?.response?.status === 401) {
          return rejectWithValue({
            message: 'خطای احراز هویت',
            username: err.response?.data?.error?.username,
            password: err.response?.data?.error?.password,
          });
        } else if (err?.response?.status >= 500) {
          return rejectWithValue({
            message: errorMessages.internalServerError,
            detail: err.message,
          });
        }
        throw err;
      } else if (err?.request) {
        return rejectWithValue({
          message: errorMessages.networkError,
          detail: err.message,
        });
      } else {
        return rejectWithValue({
          message: errorMessages.internalAppError,
          detail: err.message,
        });
      }
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getStoredUser actions
      .addCase(getStoredUser.pending, state => {
        state.status = AuthFetchStatus.GET_STORED_USER;
      })
      .addCase(getStoredUser.fulfilled, (state, action) => {
        const storedUser = action.payload;
        if (storedUser) {
          state.status = AuthFetchStatus.LOGGED_IN;
          state.userInfo = storedUser.userInfo;
          state.accessToken = storedUser.accessToken;
        } else {
          state.status = AuthFetchStatus.LOGGED_OUT;
        }
        state.error = null;
      })
      .addCase(getStoredUser.rejected, (state, action) => {
        state.status = AuthFetchStatus.GET_STORED_USER_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      })
      // login actions
      .addCase(login.pending, state => {
        state.status = AuthFetchStatus.SENDING_CREDENTIALS;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = AuthFetchStatus.LOGGED_IN;
        state.error = null;
        state.userInfo = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = AuthFetchStatus.AUTH_FAILED;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export default authSlice.reducer;

export const selectAuthFetchStatus = (state: RootState) => state.auth.status;
export const selectAuthAccessToken = (state: RootState) =>
  state.auth.accessToken;
