import {Injectable}          from '@angular/core';
import {CanDeactivate}       from '@angular/router';
import {SubscriptionService} from "../services/subscription-service";

@Injectable({
    providedIn: 'root'
})
export class SocketSubscriptionCleanGuard implements CanDeactivate<any>
{
    constructor(private subscriptionService: SubscriptionService)
    {
        window.addEventListener('beforeunload', () =>
        {
            this.subscriptionService.unsubscribe();
        });
    }

    canDeactivate(): boolean
    {
        this.subscriptionService.unsubscribe();
        return true;
    }
}
