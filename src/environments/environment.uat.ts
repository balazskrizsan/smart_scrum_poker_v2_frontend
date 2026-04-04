import {LogLevel} from "angular-auth-oidc-client";

export const environment = {
  production: false,
  oidc: {
    tokenRefreshInSeconds: 1500, // 25min
    logLevel: LogLevel.Debug
  },
  frontend: {
    host: 'https://uat.smartscrumpoker.balazskrizsan.com/'
  },
  backend: {
    api: {
      host: 'https://api.uat.smartscrumpoker.balazskrizsan.com/'
    },
    wss_api: {
      host: 'wss://api.uat.smartscrumpoker.balazskrizsan.com/ws'
    }
  }
};
