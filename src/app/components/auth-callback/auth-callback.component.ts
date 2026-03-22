import {Component} from '@angular/core';

@Component({
    selector:   'app-auth-callback',
    standalone: true,
    template:   `
                  <div class="container text-center" style="margin-top: 100px;">
                    <h3>Authentication in progress...</h3>
                    <p>Please wait while we complete your login.</p>
                  </div>
                `
})
export class AuthCallbackComponent
{
    constructor()
    {
    }
}
