import {LogLevel} from "angular-auth-oidc-client";

export const environment = {
  production: true,
  oidc: {
    tokenRefreshInSeconds: 1500, // 25min
    logLevel: LogLevel.Debug
  },
  frontend: {
    host: 'https://smartscrumpoker.com/'
  },
  backend: {
    api: {
      host: 'https://api.smartscrumpoker.com/'
    },
    wss_api: {
      host: 'wss://api.smartscrumpoker.com/ws'
    }
  }
};
