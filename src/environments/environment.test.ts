export const environment = {
  production: false,
  apiUrl: 'https://test-api.hivefund.zw/api',
  apiTimeout: 30000,
  tokenRefreshBuffer: 300000, // 5 minutes before expiry
  otpResendCooldown: 60000, // 60 seconds
  storagePrefix: 'hivefund_test_',
  enableLogging: true,
  useMockData: false,
};
