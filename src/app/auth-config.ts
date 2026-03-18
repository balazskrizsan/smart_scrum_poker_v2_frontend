import {
  LogLevel,
  OpenIdConfiguration
} from 'angular-auth-oidc-client';

export const authConfig = {
  config: {
    authority: 'https://localhost:4040',
    clientId: 'smart_scrum_poker_frontend',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    responseType: 'code',
    scope: 'openid profile',
    silentRenewUrl: `${window.location.origin}/silent-renew.html`,
    silentRenew: false,
    logLevel: LogLevel.Debug,
    useRefreshToken: true,
    ignoreNonceAfterRefresh: true,
    autoUserInfo: true,
    tokenRefreshInSeconds: 1800,
    historyCleanupOff: true
  }
};
