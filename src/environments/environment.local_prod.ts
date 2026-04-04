import {LogLevel} from "angular-auth-oidc-client";

export const environment = {
  production: true,
  oidc: {
    tokenRefreshInSeconds: 1500, // 25min
    logLevel: LogLevel.Debug
  },
  frontend: {
    host: 'https://smart-scrum-poker.localhost.balazskrizsan.com/'
  },
  backend: {
    api: {
      host: 'https://api--smart-scrum-poker.localhost.balazskrizsan.com/'
    },
    wss_api: {
      host: 'wss://api--smart-scrum-poker.localhost.balazskrizsan.com/ws'
    }
  }
};
