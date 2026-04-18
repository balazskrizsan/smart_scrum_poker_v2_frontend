import {Injectable}  from '@angular/core';
import {
    CanActivate,
    Router
}                    from '@angular/router';
import {Observable}  from 'rxjs';
import {
    map,
    take
}                    from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {IdsUserService} from "../services/ids-user-service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
    constructor(
      private idsUserService: IdsUserService,
      private router: Router
    )
    {
    }

    canActivate(): Observable<boolean>
    {
        return this.idsUserService.isAuthenticated$().pipe(
          take(1),
          map(isAuthenticated =>
          {
              if (!isAuthenticated)
              {
                  alert("must be logged in")
                  this.router.navigate(['/']);

                  return false;
              }
              return true;
          })
        );
    }
}
