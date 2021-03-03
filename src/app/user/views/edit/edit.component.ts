import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AUTH_CONSTANTS } from '../../../auth/constants';
import { USER_CONSTANTS } from '../../constants';
import { APP_CONFIG, USER_TYPES } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { USER_VALIDATOR } from '../../validator';
import { UserService } from '../../services/user.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    user: any= {};
    users= [];
    userForm: FormGroup;
    userTypes: any= [];
    currentUser=undefined;
    selectedUserType= {id: 0, name: ''};
    USER_VALIDATOR= USER_VALIDATOR;
    USER_CONSTANTS= USER_CONSTANTS;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    USER_TYPES= USER_TYPES;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: USER_CONSTANTS.LABEL.USER,
        pageTitle: USER_CONSTANTS.LABEL.USER_EDIT,
        pageDesc: USER_CONSTANTS.LABEL.USER_EDIT_DESC
    };
    steps= [];
    currentPage= 0;
    pageSize= 8;
    buttonName= USER_CONSTANTS.LABEL.USER_ACTION_EDIT;
    backUrl= USER_CONSTANTS.URL.USER_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorUsername: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.USER_TYPES = USER_TYPES;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.USER_VALIDATOR = USER_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_LIST_LINK, USER_CONSTANTS.URL.USER_LIST, true);
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_EDIT_LINK, USER_CONSTANTS.URL.USER_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.USER_CONSTANTS.LABEL.USER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadUser(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
             () => {
                 this.currentUser = authenticationService.getCurrentUser();

             }
        );
    }

    ngOnInit() {
        this.userForm = this.createUserForm();
        this.loadUser(this.alias);
    }

    createUserForm(): FormGroup {
        return this.userForm = this._formBuilder.group({
            firstName             : [this.user.firstName, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            username              : [this.user.username, [Validators.required, Validators.minLength(3)]],
            designation           : [this.user.designation, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            lastName              : [this.user.lastName, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            email                 : [this.user.email, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            phoneNo               : [this.user.phoneNo, [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]],
            userType              : [this.user.userType, []],
            //secondary              : [this.user.secondary, []],

        });
    }

    loadUser(alias) {
        this.userService.getUser(alias)
        .subscribe(
            data => {
                this.user = data['data'][0];
                this.userForm = this.createUserForm();
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            }
        );
    }

    updateUser(form) {
        var userObj = this.userForm.value;
        $('body').addClass('loading');
        this.user.firstName = userObj.firstName;
        this.user.username = userObj.email;
        this.user.lastName = userObj.lastName;
        this.user.gender = userObj.gender;
        this.user.email = userObj.email;
        this.user.designation = userObj.designation;
        this.user.phoneNo = userObj.phoneNo;
        //this.user.secondary = userObj.secondary;
        this.userService.updateUser(this.user)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                if (data['hasError']) {
                    this.user = data['data'];
                    this.assignResponseError(data, form);
                } else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
                }
                this.loading = false;
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            }
        );

    }

    validatePassword(form) {
        if (this.userForm.get('password').value === this.userForm.get('confirmPassword').value) {
            if (form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD]){
                form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD].setErrors(null);
            }
            return true;
            }else {
                if (form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD]) {
                form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD].setErrors({match: true});
            }
            return false;
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

    loadUserTypes() {
        this.userService.getAllUserTypes(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.userTypes = data['data'];
            }
            this.loading = false;
        },
            () => {
                this.loading = false;
            }
        );
    }

    list() {
        this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
    }
}
