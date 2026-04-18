import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit
}                              from '@angular/core';
import {UrlService}            from './modules/commons/services/url-service';
import {IUserProfile}          from "./modules/account/interfaces/i-user-profile";
import {EventEnum}             from "./modules/account/enums/event-enum";
import {RouterModule}          from '@angular/router';
import {CommonModule}          from "@angular/common";
import {FlashMessageComponent} from "./modules/flash-message/flash-message.component";
import {AuthService}           from "./services/auth.service";
import {Observable}            from 'rxjs';
import {map}                   from 'rxjs/operators';
import {IdsUserService}        from "./services/ids-user-service";

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
    public currentUser: IUserProfile | null = null;
    public accountEvents: EventEmitter<EventEnum>;
    protected isMenuOpen = false;
    private excludedElement = null;
    public isAuthenticated$: Observable<boolean>;
    public userNickname$: Observable<string>;
    public isNotAuthenticated$: Observable<boolean>;

    public constructor(
      private el: ElementRef,
      private authService: AuthService,
      private idsUserService: IdsUserService
    )
    {
        this.isAuthenticated$ = this.idsUserService.isAuthenticated$();
        this.userNickname$ = this.idsUserService.getUserNickname$();
        this.isNotAuthenticated$ = this.isAuthenticated$.pipe(map(authenticated => !authenticated));
    }

    public ngOnInit(): void
    {
        this.excludedElement = this.el.nativeElement.querySelector('.header-menu');

        this.authService.checkAuth$().subscribe();
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
