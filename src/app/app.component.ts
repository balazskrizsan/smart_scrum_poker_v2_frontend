import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit
}                              from '@angular/core';
import {UrlService}            from './modules/commons/services/url-service';
import {RxStompService}        from "./modules/commons/services/rx-stomp-service";
import {AccountService}        from "./modules/account/service/account-service";
import {IInsecureUser}         from "./modules/account/interfaces/i-insecure-user";
import {EventEnum}             from "./modules/account/enums/event-enum";
import {RouterModule}          from '@angular/router';
import {CommonModule}          from "@angular/common";
import {FlashMessageComponent} from "./modules/flash-message/flash-message.component";
import {AuthService}           from "./services/auth.service";
import {OidcSecurityService}   from 'angular-auth-oidc-client';
import {Observable}            from 'rxjs';
import {map}                   from 'rxjs/operators';

export interface IIdentityServerUser
{
    name: string,
    picture: string,
    preferred_username: string,
    sub: string,
}

@Component({
    selector:    'app-root',
    standalone:  true,
    imports:     [RouterModule, CommonModule, FlashMessageComponent],
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.scss'],
})
export class AppComponent implements OnInit
{
    public urlService = UrlService;
    public currentUser: IInsecureUser | null = null;
    public accountEvents: EventEmitter<EventEnum>;
    protected isMenuOpen = false;
    private excludedElement = null;
    public isAuthenticated$: Observable<boolean>;
    public userName$: Observable<string>;
    public isNotAuthenticated$: Observable<boolean>;

    public constructor(
      private rxStompService: RxStompService,
      private accountService: AccountService,
      private el: ElementRef,
      private authService: AuthService,
      private oidcSecurityService: OidcSecurityService
    )
    {
        this.rxStompService.get();
        this.accountEvents = this.accountService.getAccountEvents();
        this.isAuthenticated$ = this.authService.isAuthenticated();
        this.userName$ = this.authService.getUserName();
        this.isNotAuthenticated$ = this.isAuthenticated$.pipe(map(authenticated => !authenticated));
        
        this.accountEvents.subscribe(event =>
        {
            switch (event)
            {
                case EventEnum.USER_LOGIN:
                    this.currentUser = this.accountService.getCurrentUser();
                    break;
                case EventEnum.USER_LOGOUT:
                    this.currentUser = null;
                    break;
            }
        });

        this.currentUser = this.accountService.getCurrentUserOrNull();
    }

    public ngOnInit(): void
    {
        this.excludedElement = this.el.nativeElement.querySelector('.header-menu');

        this.authService.checkAuth().subscribe();
    }

    openMobileMenu()
    {
        setTimeout(() => this.isMenuOpen = true, 50);
    }

    @HostListener('window:click', ['$event'])
    closeMobileMenu(event: Event)
    {
        if (!this.isMenuOpen)
        {
            return;
        }

        if (this.excludedElement && this.excludedElement.contains(event.target as Node))
        {
            return;
        }

        this.isMenuOpen = false;
    }

    public login(): void
    {
        this.authService.login();
    }

    public logout(): void
    {
        this.authService.logout();
    }
}
