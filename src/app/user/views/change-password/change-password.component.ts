import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { USER_CONSTANTS } from '../../constants';
import { USER_VALIDATOR } from '../../validator';
import { APP_CONFIG, USER_TYPES } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { UserService } from '../../services/user.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    user: any= {};
    alias: any= {};
    userType: any= {};
    userForm: FormGroup;
    passwordUser: any= {};
    USER_CONSTANTS= USER_CONSTANTS;
    USER_TYPES= USER_TYPES;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    USER_VALIDATOR= USER_VALIDATOR;
    setting = {
        entity: USER_CONSTANTS.LABEL.USER,
        pageTitle: USER_CONSTANTS.LABEL.USER_CHANGE_PASSWORD,
        pageDesc: USER_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= USER_CONSTANTS.LABEL.USER_ACTION_CREATE;
    backUrl= USER_CONSTANTS.URL.USER_LIST;
    formValidation= {
    duplicateErrorName: false,
    duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private userService: UserService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.USER_TYPES = USER_TYPES;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.USER_VALIDATOR = USER_VALIDATOR;
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_LIST_LINK, USER_CONSTANTS.URL.USER_LIST, false);
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_LINK, USER_CONSTANTS.URL.USER_CHANGE_PASSWORD, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.USER_CONSTANTS.LABEL.USER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadUser(this.alias);
        });

    }

    ngOnInit() {
        this.userForm = this.createUserForm();
        this.passwordUser = {};
    }

    createUserForm(): FormGroup {
        return this.userForm = this._formBuilder.group({
            id                : [this.user.id ? this.user.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    updateUser() {
        var userObj = this.userForm.value;
        $('body').addClass('loading');
        userObj.username = this.user.username;
        this.userService.updatePassword(this.user.alias, userObj)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                if (data['hasError']) {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                }else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
                    this.passwordUser = {};
                }

                this.loading = false;
            },
            error => {
                this.sweetAlertService.notSuccessful(error.message);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
                this.loading = false;
            });
    }

    validateForm() {
        let valid = true;
        if (this.userForm.get(USER_CONSTANTS.FIELD.PASSWORD).value === this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
        }else {
            this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
            valid = false;
        }
       return valid;
    }

    submitForm() {
        this.updateUser( );
    }

    list() {
        this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
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
            this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            this.loading = false;
        });
    }
}
