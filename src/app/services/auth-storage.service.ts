import {Injectable}              from '@angular/core';
import {AbstractSecurityStorage} from 'angular-auth-oidc-client';
import {LocalStorageService}     from "./local-storage-service";

@Injectable({
    providedIn: 'root'
})
export class AuthStorageService implements AbstractSecurityStorage
{
    constructor(private localStorageService: LocalStorageService) {}

    read(key: string): string | null
    {
        return this.localStorageService.get(key);
    }

    write(key: string, value: string): void
    {
        this.localStorageService.set(key, value);
    }

    remove(key: string): void
    {
        this.localStorageService.delete(key);
    }

    clear(): void
    {
        const prefixes = ['oidc.', 'auth', 'ssp-oidc.', 'ssp-auth'];

        Object.keys(localStorage)
          .filter(key => prefixes.some(p => key.startsWith(p)))
          .forEach(key => localStorage.removeItem(key));
    }
}
