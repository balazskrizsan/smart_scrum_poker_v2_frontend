import {
    AbstractSecurityStorage,
    AuthModule
}                           from 'angular-auth-oidc-client';
import {NgModule}           from "@angular/core";
import {AuthStorageService} from "./services/auth-storage.service";
import {environment}        from "../environments/environment";
import {IdsUserService}     from "./services/ids-user-service";

@NgModule({
    imports:   [
        AuthModule.forRoot({
            config: {
                authority:             environment.ids.host,
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
    constructor(private idsUserService: IdsUserService) {
        this.idsUserService.initializeAuthState();
    }
}
