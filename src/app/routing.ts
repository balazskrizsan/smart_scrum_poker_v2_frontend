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
                  .then(m => m.IndexActionComponent)
            }
        ]
    },
    {
        path:     'poker',
        canDeactivate: [SocketSubscriptionCleanGuard],
        canActivate: [AuthGuard],
        children: [
            {
                path:          '',
                loadComponent: () => import('./modules/poker/controllers/create-action.component')
                  .then(m => m.CreateActionComponent)
            },
            {
                path:          'create',
                loadComponent: () => import('./modules/poker/controllers/create-action.component')
                  .then(m => m.CreateActionComponent)
            },
            {
                path:          'my-pokers',
                loadComponent: () => import('./modules/poker/controllers/my-pokers-action.component')
                  .then(m => m.MyPokersActionComponent)
            },
            {
                path:          'display/:pokerPublicId',
                loadComponent: () => import('./modules/poker/controllers/display-action.component')
                  .then(m => m.DisplayActionComponent)
            }
        ]
    },
];
