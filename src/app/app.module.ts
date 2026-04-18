import {BrowserModule}           from '@angular/platform-browser';
import {NgModule}                from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule}            from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule
}                         from '@angular/forms';
import {OidcConfigModule} from "./oidc-config.module";
import {IdsUserService} from "./services/ids-user-service";

@NgModule(
  {
      declarations: [],
      imports:      [
          BrowserModule,
          BrowserAnimationsModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule.forRoot([]),
          OidcConfigModule,
      ],
      bootstrap:    [],
  }
)
export class AppModule
{
    constructor(private idsUserService: IdsUserService) {
        this.idsUserService.initializeAuthState();
    }
}
