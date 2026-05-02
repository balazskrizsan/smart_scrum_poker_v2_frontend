import {Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AuthCallbackComponent} from './components/auth-callback/auth-callback.component';
import {SocketSubscriptionCleanGuard} from "./guards/socket-subscription-clean.guard";

export const routes: Routes = [
    {
        path:     'auth-callback',
        canDeactivate: [SocketSubscriptionCleanGuard],
        component: AuthCallbackComponent
    },
    {
        path:     '',
        canDeactivate: [SocketSubscriptionCleanGuard],
        children: [
            {
                path:          '',
                loadComponent: () => import('./modules/home/actions/index-action.component')
                  .then(m => m.IndexActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            }
        ]
    },
    {
        path:     'poker',
        canActivate: [AuthGuard],
        children: [
            {
                path:          '',
                loadComponent: () => import('./modules/poker/controllers/create-action.component')
                  .then(m => m.CreateActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'create',
                loadComponent: () => import('./modules/poker/controllers/create-action.component')
                  .then(m => m.CreateActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'my-pokers',
                loadComponent: () => import('./modules/poker/controllers/my-pokers-action.component')
                  .then(m => m.MyPokersActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'display/:pokerPublicId',
                loadComponent: () => import('./modules/poker/controllers/display-action.component')
                  .then(m => m.DisplayActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            }
        ]
    },
];
