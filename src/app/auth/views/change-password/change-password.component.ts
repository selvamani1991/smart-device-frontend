import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { AUTH_CONSTANTS } from '../../constants';

import { USER_VALIDATOR } from '../../../user/validator';

import { APP_CONFIG, APP_CONSTANTS, USER_TYPES } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../../user/services/user.service';

import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    currentUser = undefined;
    user: any = {};
    alias: any = {};
    userType: any = {};
    userForm: FormGroup;
    passwordUser: any= {};
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    USER_TYPES = USER_TYPES;
    APP_CONFIG = APP_CONFIG;
    ERROR_CODE = ERROR_CODE;
    SUCCESS_CODE = SUCCESS_CODE;
    USER_VALIDATOR = USER_VALIDATOR;
    setting = {
        entity: AUTH_CONSTANTS.LABEL.USER,
        pageTitle: AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD,
        pageDesc: AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= AUTH_CONSTANTS.LABEL.USER_ACTION_CREATE;
    backUrl= AUTH_CONSTANTS.URL.DASHBOARD;
    formValidation= {
    duplicateErrorName: false,
    duplicateErrorEmail: false
    };
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private httpResponseService: HttpResponseService,
    private breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.USER_TYPES = USER_TYPES;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.USER_VALIDATOR = USER_VALIDATOR;
        breadCrumService.pushStep(AUTH_CONSTANTS.LABEL.USER_LIST_LINK, AUTH_CONSTANTS.URL.DASHBOARD, false);
        breadCrumService.pushStep(AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_LINK, AUTH_CONSTANTS.URL.CHANGE_PASSWORD, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.AUTH_CONSTANTS.LABEL.USER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadUser(this.alias);
        });
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
            id                : [ this.user.id ? this.user.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    updateUser() {
        var userObj = this.userForm.value;
        userObj.username = this.user.username;
        this.authenticationService.updatePassword(this.user.alias, userObj)
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

    submitForm(user, form) {
        this.updateUser( );
    }

    list(user) {
        this.router.navigate([AUTH_CONSTANTS.URL.DASHBOARD]);
    }

    loadUser(alias) {
        this.userService.getUser(alias)
        .subscribe(
        data => {
        this.user = data['data'][0];
        this.userForm = this.createUserForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([AUTH_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }


}
