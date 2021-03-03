import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ROLE_CONSTANTS } from '../../constants';
import { ROLE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';

import { RoleService } from '../../services/role.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';


@Component({
    selector: 'role-form-modal',
    moduleId: module.id.toString(),
    templateUrl: 'role-form-modal.component.html'
})
export class RoleFormModalComponent implements OnInit {
    @Input() role;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    ROLE_VALIDATOR= ROLE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    roleForm: FormGroup;
    setting = {
        entity: ROLE_CONSTANTS.LABEL.ROLE,
    };
    steps= [];
    buttonName= ROLE_CONSTANTS.LABEL.ROLE_ACTION_CREATE;
    buttonName1= ROLE_CONSTANTS.LABEL.ROLE_ACTION_EDIT;
    backUrl= ROLE_CONSTANTS.URL.ROLE_LIST;
    constructor(
                private router: Router,
                private roleService: RoleService,
                private _formBuilder: FormBuilder,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
         this.APP_CONFIG = APP_CONFIG;
         this.ROLE_CONSTANTS = ROLE_CONSTANTS;
         this.ROLE_VALIDATOR = ROLE_VALIDATOR;
         this.ERROR_CODE = ERROR_CODE;
         this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROLE_CONSTANTS.LABEL.ROLE);
    }
    ngOnInit() {
        this.roleForm = this.createRoleForm();
    }

    submitForm(role, form) {
        if (role.id) {
            this.updateRole(role);
        }else {
            this.createCall(role, form);
        }
    }

    createRoleForm(): FormGroup {
        return this.roleForm = this._formBuilder.group({
            id                  : [this.role.id],
            name                : [this.role.name, [Validators.required, Validators.minLength(3)]],
            description         : [this.role.description, [Validators.required, Validators.minLength(3)]],

        });
    }

    createCall(role, form) {
        $('body').addClass('loading');
        this.roleService.saveRole(role)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.role = data['data'][0];
                this.assignResponseError(data, form);
                this.roleForm = this.createRoleForm();
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                $('#formModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.error.error.errorMessageCode);
            $('#formModal').modal('hide');
            this.loading = false;
            this.submitEvent.emit(1);
        });
    }

    updateRole(role) {
        this.loading = true;
        $('body').addClass('loading');
        this.roleService.updateRole(role.alias, role)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.role = data['data'][0];
            } else {
                $('#formModal').modal('hide');
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
            this.loading = false;
            this.submitEvent.emit(1);
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            form.form.controls[data.error.errorField].setErrors({duplicate: true});
        }
    }

}
