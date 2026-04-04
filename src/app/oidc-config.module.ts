import {
    AbstractSecurityStorage,
    AuthModule
}                           from 'angular-auth-oidc-client';
import {NgModule}           from "@angular/core";
import {AuthStorageService} from "./services/auth-storage.service";
import {environment}        from "../environments/environment";

@NgModule({
    imports:   [
        AuthModule.forRoot({
            config: {
                authority:             'https://localhost:4040',
                clientId:              'smart_scrum_poker_frontend',
                redirectUrl:           window.location.origin + '/auth-callback',
                postLogoutRedirectUri: window.location.origin,
                silentRenewUrl:        `${window.location.origin}/silent-renew.html`,
                scope:                 'openid offline_access profile nickname poker.start',
                responseType:          'code',
                silentRenew:           true,
                useRefreshToken:       true,
                tokenRefreshInSeconds: environment.oidc.tokenRefreshInSeconds,
                logLevel:              environment.oidc.logLevel,
            }
        }),
    ],
    providers: [
        {provide: AbstractSecurityStorage, useClass: AuthStorageService},
    ],
    exports:   [AuthModule],
})
export class OidcConfigModule
{
}
