export const apiUrl = 'http://192.168.43.251:3001';
export const requestTimeout = 30000; // 0: no timeout

// error messages
export const errorMessages = {
  statusErrorFromServer: (statusCode: any) => `خطای ${statusCode} از سرور`,
  notAuthorized: 'خطای احراز هویت. مجدد وارد حساب کاربری شوید',
  forbidden: 'درخواست غیر مجاز',
  internalServerError: 'خطای داخلی سرور.',
  networkError:
    'خطای شبکه. میتواند به دلیل اتصال اینترنت شما یا تنظیمات امنیتی سرور باشد.',
  internalAppError: 'خطای داخلی برنامه. لطفا به توسعه دهنده اطلاع دهید.',
  localStorageError: 'خطا در برقراری ارتباط با حافظه داخلی دستگاه.',
};
