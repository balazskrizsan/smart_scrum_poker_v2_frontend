import {Injectable}   from '@angular/core';
import {
    OidcSecurityService,
    UserDataResult
}                     from 'angular-auth-oidc-client';
import {
    BehaviorSubject,
    Observable
}                     from 'rxjs';
import {AuthService}  from './auth.service';
import {
    map,
    take
}                     from "rxjs/operators";
import {IUserProfile} from "../modules/account/interfaces/i-user-profile";

@Injectable({
    providedIn: 'root'
})
export class IdsUserService
{
    private isLoggedInBS = new BehaviorSubject<boolean>(false);
    public isLoggedIn$: Observable<boolean> = this.isLoggedInBS.asObservable();

    private userNickNameBS = new BehaviorSubject<string>(null);
    private userNickName$: Observable<string> = this.userNickNameBS.asObservable();

    private subBS = new BehaviorSubject<string>(null);
    private sub$: Observable<string> = this.subBS.asObservable();

    constructor(private oidcSecurityService: OidcSecurityService, private authService: AuthService)
    {
    }

    get isLoggedIn(): boolean
    {
        return this.isLoggedInBS.value;
    }

    get userNickName(): string
    {
        return this.userNickNameBS.value;
    }

    get sub(): string
    {
        return this.subBS.value;
    }

    get subOrRedirectToLogin(): string
    {

        return this.subBS.value;
    }

    getUserNickname$(): Observable<string>
    {
        console.log("XXXXXXXXXXXXXXX", this.getUserInfo().pipe(map(info => info)).subscribe(t => console.log(t)));

        return this.getUserInfo().pipe(map(info => info?.userData?.nickname || info?.userData?.name || 'N/A'));
    }

    getUserInfo(): Observable<UserDataResult>
    {
        return this.oidcSecurityService.userData$;
    }

    isAuthenticated$(): Observable<boolean>
    {
        return this.oidcSecurityService.isAuthenticated$.pipe(map(ar => ar.isAuthenticated));
    }

    public getUserProfileSub$(): Observable<string>
    {
        return this.getUserInfo().pipe(map(info => info?.userData?.sub));
    }

    public getCurrentUserProfileOrRedirect(): IUserProfile
    {
        this.isAuthenticated$().pipe(take(1)).subscribe(isAuthenticated =>
        {
            if (!isAuthenticated)
            {
                this.authService.login();
                return;
            }
        });

        return
    }

    public initializeAuthState(): void
    {
        console.log("****> IDS User service init");
        this.oidcSecurityService.isAuthenticated$.subscribe(authResult =>
        {
            console.log("****> IDS User service init with result", authResult);
            this.updateLoginStatus(authResult.isAuthenticated);
        });
    }

    private updateLoginStatus(isAuthenticated: boolean): void
    {
        this.isLoggedInBS.next(isAuthenticated);
        if (isAuthenticated)
        {
            this.getUserNickname$().subscribe(nickName =>
            {
                this.userNickNameBS.next(nickName);
            });
            this.getUserProfileSub$().subscribe(sub =>
            {
                console.log("****> Setting up subject", sub);
                this.subBS.next(sub)
            });
        } else
        {
            this.userNickNameBS.next("")
            this.subBS.next(null);
        }
    }
}
