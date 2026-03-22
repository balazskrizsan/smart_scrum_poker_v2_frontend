import {
    AbstractSecurityStorage,
    AuthModule,
    LogLevel
}                           from 'angular-auth-oidc-client';
import {NgModule}           from "@angular/core";
import {AuthStorageService} from "./services/auth-storage.service";

@NgModule({
    imports:   [
        AuthModule.forRoot({
            config: {
                authority:             'https://localhost:4040',
                clientId:              'smart_scrum_poker_frontend',
                redirectUrl:           window.location.origin + '/auth-callback',
                postLogoutRedirectUri: window.location.origin,
                silentRenewUrl:        `${window.location.origin}/silent-renew.html`,
                scope:                 'openid profile offline_access',
                responseType:          'code',
                silentRenew:           true,
                useRefreshToken:       true,
                tokenRefreshInSeconds: 300,
                logLevel:              LogLevel.Debug,
            }
        }),
    ],
    providers: [
        {provide: AbstractSecurityStorage, useClass: AuthStorageService},
    ],
    exports:   [AuthModule],
})
export class AuthConfigModule
{
}
