import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ROLE_CONSTANTS } from '../../constants';
import { ROLE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../../constants';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { RoleService } from '../../services/role.service';

import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    role: any= {};
    roles= [];
    roleForm: FormGroup;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    ROLE_VALIDATOR= ROLE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    setting = {
        entity: ROLE_CONSTANTS.LABEL.ROLE,
        pageTitle: ROLE_CONSTANTS.LABEL.ROLE_CREATE,
        pageDesc: ROLE_CONSTANTS.LABEL.ROLE_CREATE_DESC
    };
    steps= [];
    buttonName= ROLE_CONSTANTS.LABEL.ROLE_ACTION_CREATE;
    backUrl= ROLE_CONSTANTS.URL.ROLE_LIST;
    formValidation= {
        duplicateErrorRolename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private roleService: RoleService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.ROLE_CONSTANTS = ROLE_CONSTANTS;
        this.ROLE_VALIDATOR = ROLE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_LIST_LINK, ROLE_CONSTANTS.URL.ROLE_LIST, true);
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_CREATE_LINK, ROLE_CONSTANTS.URL.ROLE_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROLE_CONSTANTS.LABEL.ROLE);

    }

    ngOnInit() {

        this.roleForm = this.createRoleForm();

    }

    createRoleForm(): FormGroup {
        return this.roleForm = this._formBuilder.group({
            id                  : [this.role.id],
            name                : [this.role.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description         : [this.role.description, [Validators.required, Validators.minLength(3)]],
        });
    }

    createRole(form) {
        this.role = this.roleForm.value;
        $('body').addClass('loading');
        this.roleService.saveRole(this.role)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, form);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
        });

    }

    assignResponseError(data, form) {
         if (data.error.errorCode === ERROR_CODE.code_14) {
             if (data.error.errorField === ROLE_CONSTANTS.FIELD.NAME) {
                 form.form.controls[ROLE_CONSTANTS.FIELD.NAME_FIELD].setErrors({'duplicate': true});
             }
         }
    }
    list() {
                this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
        }

}
