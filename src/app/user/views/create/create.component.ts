import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { USER_CONSTANTS } from '../../constants';
import { USER_VALIDATOR } from '../../validator';
import { APP_CONFIG, USER_TYPES } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { UserService } from '../../services/user.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    currentUser= undefined;
    user: any= {};
    userObj: any= {};
    users: any= [];
    userTypes: any= [];
    userTypeItems: any= [];
    userTypeItem: any= {};
    userType: any= {};
    alias: any= {};
    userForm: FormGroup;
    active= true;
    USER_CONSTANTS= USER_CONSTANTS;
    USER_TYPES= USER_TYPES;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    geSize= this.APP_CONFIG.PAGE_SIZE;
    SUCCESS_CODE= SUCCESS_CODE;
    USER_VALIDATOR= USER_VALIDATOR;
    setting = {
        entity: USER_CONSTANTS.LABEL.USER,
        pageTitle: USER_CONSTANTS.LABEL.USER_CREATE,
        pageDesc: USER_CONSTANTS.LABEL.USER_CREATE_DESC
    };
    steps= [];
    buttonName= USER_CONSTANTS.LABEL.USER_ACTION_CREATE;
    backUrl= USER_CONSTANTS.URL.USER_LIST;
    formValidation= {
        duplicateErrorName: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
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
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_LIST_LINK, USER_CONSTANTS.URL.USER_LIST, true);
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_CREATE_LINK, USER_CONSTANTS.URL.USER_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.USER_CONSTANTS.LABEL.USER);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                if (this.currentUser) {
                    this.userTypes = [{id: this.currentUser.userType, name: this.currentUser.userType}];
                }

            }
        );

    }

    ngOnInit() {
         this.userForm = this.createUserForm();
          $('.select2').select2({
                   width: '100%'
         });
         this.userForm.get('confirmPassword').setErrors(null);
    }

    createUserForm(): FormGroup {
        return this.userForm = this._formBuilder.group({
            id               : [this.user.id],
            firstName        : [this.user.firstName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            username         : [this.user.username],
            designation      : [this.user.designation, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            lastName         : [this.user.lastName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            email            : [this.user.email, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            password         : [this.user.password, [Validators.required, Validators.minLength(3)]],
            confirmPassword  : [this.user.confirmPassword, [Validators.required, Validators.minLength(3)]],
            phoneNo          : [this.user.phoneNo, [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]],
            userType         : [this.currentUser.userType],
            secondary        : [false,[Validators.required]],
        });
    }

    createUser(form) {
        this.userObj = this.userForm.value;
        $('body').addClass('loading');
        this.user = {
            userType : this.userObj.userType,
            firstName: this.userObj.firstName,
            lastName: this.userObj.lastName,
            username: this.userObj.email,
            gender: this.userObj.gender,
            email: this.userObj.email,
            designation: this.userObj.designation,
            secondary: this.userObj.secondary,
            password: this.userObj.password,
            confirmPassword: this.userObj.confirmPassword,
            phoneNo: this.userObj.phoneNo

        };
        this.userService.saveUser(this.user)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                  this.assignResponseError(data, form);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            }
            this.loading = false;
        },
        failure => {
             $('body').removeClass('loading');
             this.httpResponseService.showErrorResponse(failure);
             this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
             this.loading = false;
        });
    }

    validateForm(form) {
        if (this.userType.id == 0) {
            form.form.controls['userType'].setErrors({'required': true});
        }
        return true;
    }

    keyDownHandler(event) {
        if (event.code === 'Space'+ '' + 'Space') {
            event.preventDefault();
        }
    }

    validatePassword(form) {
        let valid = true;
        if (!this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.userForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.userForm.get(USER_CONSTANTS.FIELD.PASSWORD).value === this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.userForm.get(USER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }

    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == USER_CONSTANTS.FIELD.USER_NAME) {
                    form.form.controls[USER_CONSTANTS.FIELD.USER_NAME_FIELD].setErrors({'duplicate': true});
            }
            if (data.error.errorField == USER_CONSTANTS.FIELD.PHONE_NO) {
                 form.form.controls[USER_CONSTANTS.FIELD.PHONE_NO_FIELD].setErrors({'duplicate': true});
            }
            if (data.error.errorField == USER_CONSTANTS.FIELD.EMAIL) {
                  form.form.controls[USER_CONSTANTS.FIELD.EMAIL_FIELD].setErrors({'duplicate': true});
            }

        }
    }

    list() {
        this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
    }

    changePassword(user) {
        this.user = user;
        $('#userPasswordModal').modal();
    }

    edit() {
        $('#userCreateModal').modal();
    }

    changeStatus(user) {
        var userStatusObj = {'username': user.username, 'status': !user.active};
        this.userService.changeStatus(userStatusObj)
        .subscribe(
            data => {
                if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_9) {
                    user.active = !user.active;
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                } else {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                }
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
        });
    }

    changeUserPassword(user) {
        this.user = user;
        $('#changePasswordModal').modal();
    }


}
