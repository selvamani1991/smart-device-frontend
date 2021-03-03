import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';



import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ScreenLockComponent } from './views/screen-lock/screen-lock.component';
import { NotConfirmedComponent } from './views/not-confirmed/not-confirmed.component';
import { ConfirmedComponent } from './views/confirmed/confirmed.component';
import { ForgotPasswordConfirmedComponent } from './views/forgot-password-confirmed/forgot-password-confirmed.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { RegisteredComponent } from './views/registered/registered.component';
import { PasswordResetComponent } from './views/password-reset/password-reset.component';
import { ForgotHelpModalComponent } from './views/forgot-help-modal/forgot-help-modal.component';
import { PrivacyContentModalComponent } from './views/privacy-content-modal/privacy-content-modal.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import {MyProfileComponent } from './views/my-profile/my-profile.component';
import {EditProfileComponent } from './views/profile-edit/profile-edit.component';
import {ChangePasswordComponent } from './views/change-password/change-password.component';
import {SubscriptionComponent } from './views/subscription/subscription.component';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../template/template.module';
import { LayoutModule } from '../layout/layout.module';

import { UserFeatureService } from './services/user-features.service';
import { AuthGuard } from './services/auth.guard';




@NgModule({
  declarations: [
      LoginComponent,
      RegisterComponent,
      ScreenLockComponent,
      NotConfirmedComponent,
      ConfirmedComponent,
      ForgotPasswordConfirmedComponent,
      RegisteredComponent,
      PasswordResetComponent,
      ForgotPasswordComponent,
      ForgotHelpModalComponent,
      PrivacyContentModalComponent,
      ResetPasswordComponent,
      MyProfileComponent,
      ChangePasswordComponent,
      SubscriptionComponent,
      EditProfileComponent

  ],
  imports: [
      TranslateModule,
      HttpClientModule,
      CommonModule,
      FormsModule,
      PerfectScrollbarModule,
      AuthRoutingModule,
      SharedModule,
      LayoutModule,
      TemplateModule,
      ReactiveFormsModule
  ],
  exports: [
      LoginComponent,
      RegisterComponent,
      ScreenLockComponent,
      NotConfirmedComponent,
      ConfirmedComponent,
      ForgotPasswordConfirmedComponent,
      RegisteredComponent,
      PasswordResetComponent,
      ForgotPasswordComponent,
      ForgotHelpModalComponent,
      PrivacyContentModalComponent,
      ResetPasswordComponent,
      MyProfileComponent,
      ChangePasswordComponent,
      SubscriptionComponent,
      EditProfileComponent

  ],
  providers: [AuthGuard, UserFeatureService],
  bootstrap: [
      LoginComponent,
      RegisterComponent,
      ScreenLockComponent,
      NotConfirmedComponent,
      ConfirmedComponent,
      ForgotPasswordConfirmedComponent,
      RegisteredComponent,
      PasswordResetComponent,
      ForgotPasswordComponent,
      ForgotHelpModalComponent,
      PrivacyContentModalComponent,
      ResetPasswordComponent,
      MyProfileComponent,
      ChangePasswordComponent,
      SubscriptionComponent,
      EditProfileComponent

  ]
})
export class AuthModule { }
