import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { ScreenLockComponent } from './views/screen-lock/screen-lock.component';
import { ForgotPasswordConfirmedComponent } from './views/forgot-password-confirmed/forgot-password-confirmed.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { PasswordResetComponent } from './views/password-reset/password-reset.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import {MyProfileComponent } from './views/my-profile/my-profile.component';
import {ChangePasswordComponent } from './views/change-password/change-password.component';
import { SubscriptionComponent } from './views/subscription/subscription.component';
import { EditProfileComponent } from './views/profile-edit/profile-edit.component';

import { AUTH_CONSTANTS } from './constants';

const authRoutes: Routes = [
    { path: AUTH_CONSTANTS.LINK.LOGIN,  component: LoginComponent },
    { path: AUTH_CONSTANTS.LINK.SCREEN_LOCK, component: ScreenLockComponent },
    { path: AUTH_CONSTANTS.LINK.FORGOT_PASSWORD, component: ForgotPasswordComponent },
    { path: AUTH_CONSTANTS.LINK.FORGOT_PASSWORD_CONFIRMATION, component: ForgotPasswordConfirmedComponent },
    { path: AUTH_CONSTANTS.LINK.PASSWORD_RESET, component: PasswordResetComponent },
    { path: AUTH_CONSTANTS.LINK.RESET_PASSWORD, component: ResetPasswordComponent },
    { path: AUTH_CONSTANTS.LINK.MY_PROFILE, component: MyProfileComponent },
    { path: AUTH_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent },
    { path: AUTH_CONSTANTS.LINK.SUBSCRIPTION, component: SubscriptionComponent },
    { path: AUTH_CONSTANTS.LINK.EDIT_PROFILE, component: EditProfileComponent }
];


@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
