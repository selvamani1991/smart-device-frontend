import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../user/services/user.service';

import { USER_VALIDATOR } from '../../../user/validator';

import { APP_CONFIG, APP_CONSTANTS, USER_TYPES } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'forgot-password-confirmed.component.html'
})

export class ForgotPasswordConfirmedComponent implements OnInit {
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    USER_TYPES = USER_TYPES;
    APP_CONFIG = APP_CONFIG;
    ERROR_CODE = ERROR_CODE;
    SUCCESS_CODE = SUCCESS_CODE;
    USER_VALIDATOR = USER_VALIDATOR;
    currentUser = undefined;
    returnUrl: string;
    userForm: FormGroup;
    email = {};
    passwordUser: any = {};
    loading = false;
    user: any = {};
    users = [];
    setting = {
        entity: AUTH_CONSTANTS.LABEL.USER,
        pageTitle: AUTH_CONSTANTS.LABEL.FORGOT_PASSWORD_CONFIRMATION_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.FORGOT_PASSWORD_CONFIRMATION_DESC
    };
    constructor(
        private titleService: Title, private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
        private sweetAlertService: SweetAlertService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.USER_TYPES = USER_TYPES;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.USER_VALIDATOR = USER_VALIDATOR;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.LOGIN_LINK));
        this.authenticationService.sessionChange$.subscribe(
            value => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.userForm = this.createUserForm();
        this.passwordUser = {};
    }

    createUserForm(): FormGroup {
        return this.userForm = this._formBuilder.group({
            email             : [ localStorage.getItem('email'), [Validators.required, Validators.minLength(3)]],
            otp               : ['', [Validators.required, Validators.minLength(3)]],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    updateUser() {
        var userObj = this.userForm.value;
        userObj.email = localStorage.getItem('email');
        this.authenticationService.forgotPasswordConfirmation(userObj)
        .subscribe(
            data => {
                if (data['hasError']) {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);

                } else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([AUTH_CONSTANTS.URL.DASHBOARD]);
                    this.passwordUser = {};
                }

                this.loading = false;
            },
            error => {
                this.sweetAlertService.notSuccessful(error.message);
                this.router.navigate([AUTH_CONSTANTS.URL.DASHBOARD]);
                this.loading = false;
            });
    }

    validateForm() {
        let valid = true;
        if (this.userForm.get(AUTH_CONSTANTS.FIELD.PASSWORD).value === this.userForm.get(AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.userForm.get(AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
        } else {
            this.userForm.get(AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
            valid = false;
        }
       return valid;
    }

    list(user) {
        this.router.navigate([AUTH_CONSTANTS.URL.DASHBOARD]);
    }

}
