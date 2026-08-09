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
    {
        path:     'pages',
        canDeactivate: [SocketSubscriptionCleanGuard],
        children: [
            {
                path:          'roadmap',
                loadComponent: () => import('./modules/pages/actions/roadmap-action.component')
                  .then(m => m.RoadmapActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'contact',
                loadComponent: () => import('./modules/pages/actions/contact-action.component')
                  .then(m => m.ContactActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'faq',
                loadComponent: () => import('./modules/pages/actions/faq-action.component')
                  .then(m => m.FaqActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'poker',
                loadComponent: () => import('./modules/pages/actions/poker-action.component')
                  .then(m => m.PokerActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            },
            {
                path:          'future',
                loadComponent: () => import('./modules/pages/actions/future-action.component')
                  .then(m => m.FutureActionComponent),
                canDeactivate: [SocketSubscriptionCleanGuard],
            }
        ]
    },
];
