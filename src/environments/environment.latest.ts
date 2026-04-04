import {LogLevel} from "angular-auth-oidc-client";

export const environment = {
  production: false,
  oidc: {
    tokenRefreshInSeconds: 1500, // 25min
    logLevel: LogLevel.Debug
  },
  frontend: {
    host: 'https://ssp-latest.balazskrizsan.com/'
  },
  backend: {
    api: {
      host: 'https://api-ssp-latest.balazskrizsan.com/'
    },
    wss_api: {
      host: 'wss://api-ssp-latest.balazskrizsan.com/ws'
    }
  }
};
