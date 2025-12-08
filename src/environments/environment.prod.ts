export const environment = {
  production: true,
  apiUrl: 'https://api.hivefund.zw/api',
  apiTimeout: 30000,
  tokenRefreshBuffer: 300000, // 5 minutes before expiry
  otpResendCooldown: 60000, // 60 seconds
  storagePrefix: 'hivefund_',
  enableLogging: false,
  useMockData: false,
};
