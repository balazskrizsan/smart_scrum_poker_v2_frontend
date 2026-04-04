import {BrowserModule}           from '@angular/platform-browser';
import {NgModule}                from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule}            from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule
}                         from '@angular/forms';
import {OidcConfigModule} from "./oidc-config.module";

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
}
