import {BrowserModule}           from '@angular/platform-browser';
import {NgModule}                from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule}            from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule
}                         from '@angular/forms';
import {AuthConfigModule} from "./auth-config.module";

@NgModule(
  {
      declarations: [],
      imports:      [
          BrowserModule,
          BrowserAnimationsModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule.forRoot([]),
          AuthConfigModule,
      ],
      bootstrap:    [],
  }
)
export class AppModule
{
}
