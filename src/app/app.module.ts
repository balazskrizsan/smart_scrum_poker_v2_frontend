import {BrowserModule}           from '@angular/platform-browser';
import {NgModule}                from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule}            from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule
}                                from '@angular/forms';
import {AuthModule}              from 'angular-auth-oidc-client';
import {authConfig}              from './auth-config';

@NgModule(
  {
      declarations: [],
      imports:      [
          BrowserModule,
          BrowserAnimationsModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule.forRoot([]),
          AuthModule.forRoot(authConfig),
      ],
      providers:    [],
      bootstrap:    [],
  }
)
export class AppModule
{
}
