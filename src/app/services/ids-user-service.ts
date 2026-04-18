import {Injectable}          from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {
    BehaviorSubject,
    Observable
}                            from 'rxjs';
import {AuthService}         from './auth.service';
import {map}                 from "rxjs/operators";
import {IUserProfile}        from "../modules/account/interfaces/i-user-profile";

@Injectable({
    providedIn: 'root'
})
export class IdsUserService
{
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
    private username: string = null;

    constructor(private oidcSecurityService: OidcSecurityService, private authService: AuthService)
    {
    }

    get isLoggedIn(): boolean
    {
        return this.isLoggedInSubject.value;
    }

    get getUsername(): string
    {
        return this.username;
    }

    getUserNickname$(): Observable<string>
    {
        return this.getUserInfo().pipe(map(info => info?.userData?.nickname || info?.userData?.name || 'N/A'));
    }

    getUserInfo(): Observable<any>
    {
        return this.oidcSecurityService.userData$;
    }

    isAuthenticated$(): Observable<boolean>
    {
        return this.oidcSecurityService.isAuthenticated$.pipe(
          map(result => result.isAuthenticated)
        );
    }

    public getCurrentUserProfileOrRedirect(): IUserProfile
    {
        if (!this.isLoggedIn)
        {
            this.authService.login();

            return ;
        }

        return
    }

    private updateLoginStatus(isAuthenticated: boolean): void
    {
        this.isLoggedInSubject.next(isAuthenticated);
        if (isAuthenticated)
        {
            this.getUserNickname$().subscribe(nickname =>
            {
                this.username = nickname;
            });
        } else
        {
            this.username = '';
        }
    }

    public initializeAuthState(): void
    {
        this.oidcSecurityService.isAuthenticated$.subscribe(authResult =>
        {
            this.updateLoginStatus(authResult.isAuthenticated);
        });
    }
}
