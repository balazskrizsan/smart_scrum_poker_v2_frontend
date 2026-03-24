import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  login(): void {
    this.localStorageService.set('redirectUrl', window.location.pathname);
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(result => result.isAuthenticated)
    );
  }

  getUserInfo(): Observable<any> {
    return this.oidcSecurityService.userData$;
  }

  getAccessToken(): Observable<string | undefined> {
    return this.oidcSecurityService.getAccessToken();
  }

  checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(
      map(({ isAuthenticated }) => {
        if (!isAuthenticated) {
          this.router.navigate(['/']);
        }
        return isAuthenticated;
      })
    );
  }

  getUserNickname(): Observable<string> {
    return this.getUserInfo().pipe(map(info => info?.userData?.nickname || info?.userData?.name || 'N/A'));
  }
}
