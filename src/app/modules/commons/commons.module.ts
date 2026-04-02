import {NgModule}                        from '@angular/core';
import {ReactiveFormsModule}             from '@angular/forms';
import {CommonModule}                    from '@angular/common';
import {SharedModule}                    from '../shared-module';
import {AuthService}                     from '../../services/auth.service';

@NgModule({
    imports:      [CommonModule, SharedModule, ReactiveFormsModule],
    exports:      [ReactiveFormsModule],
    declarations: [],
    providers:    [AuthService]
})
export class CommonsModule
{
}
