import {errorMessages} from '../config/config';

export function handleAsyncThunkAxiosError(err: any, rejectWithValue: any) {
  // the default error object to return
  // may be changed based on below conditions
  let errorObject = {
    messageTitle: errorMessages.internalAppError,
    // if backend returns standard error
    // axios response.data is an object like this => {error: {message: "..."}}
    // if server returns html page error
    // axios response.data is like this => "<html>...</html>"
    responseData: err?.response?.data?.error || err?.response?.data,
    details: err?.message,
  };

  if (err?.response) {
    if (err?.response?.status === 401) {
      errorObject = {...errorObject, messageTitle: errorMessages.notAuthorized};
    } else if (err?.response?.status === 403) {
      errorObject = {...errorObject, messageTitle: errorMessages.forbidden};
    } else {
      errorObject = {
        ...errorObject,
        messageTitle: errorMessages.statusErrorFromServer(
          err?.response?.status,
        ),
      };
    }
  } else if (err?.request) {
    errorObject = {...errorObject, messageTitle: errorMessages.networkError};
  } else {
    // nothing
  }

  return rejectWithValue(errorObject);
}
