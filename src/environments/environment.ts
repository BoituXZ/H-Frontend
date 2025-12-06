export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  tokenRefreshBuffer: 300000, // 5 minutes before expiry
  otpResendCooldown: 60000, // 60 seconds
  storagePrefix: 'hivefund_',
  enableLogging: true
};
