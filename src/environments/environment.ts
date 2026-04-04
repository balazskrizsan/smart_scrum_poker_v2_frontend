import {LogLevel} from "angular-auth-oidc-client";

export const environment = {
  production: false,
  oidc: {
    tokenRefreshInSeconds: 1500, // 25min
    logLevel: LogLevel.Debug
  },
  frontend: {
    host: 'https://localhost.balazskrizsan.com:3010/'
  },
  backend: {
    api: {
      host: 'https://localhost.balazskrizsan.com:3000/'
    },
    wss_api: {
      host: 'wss://localhost.balazskrizsan.com:3000/ws'
    }
  }
};
