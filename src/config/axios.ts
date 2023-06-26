import axios, {CreateAxiosDefaults} from 'axios';
import {apiUrl, requestTimeout} from './config';

const axiosConfig: CreateAxiosDefaults = {
  baseURL: apiUrl,
  timeout: requestTimeout,
  headers: {
    // informs server that it accepts the access token as json response (not cookie)
    // also can have other use cases
    'x-device': 'phone',
  },
};

export const api = axios.create(axiosConfig);

// redux async thunk is responsible to get token from storage or server
// then pass it to this function
export const createApiInstanceByToken = (token: any) => {
  if (!token) {
    return api;
  }
  const headers = {
    ...axiosConfig.headers,
    Authorization: `Bearer ${token}`,
  };
  return axios.create({
    ...axiosConfig,
    headers,
  });
};
