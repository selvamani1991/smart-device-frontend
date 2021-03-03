﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ROLE_CONSTANTS } from '../../constants';
import { ROLE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import { RoleService } from '../../services/role.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    role: any= {};
    city: any= {};
    roles= [];
    // cities=[];
    // selectedCity={id:0,state:'',name:'',country:''};
    roleForm: FormGroup;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    ROLE_VALIDATOR= ROLE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ROLE_CONSTANTS.LABEL.ROLE,
        pageTitle: ROLE_CONSTANTS.LABEL.ROLE_EDIT,
        pageDesc: ROLE_CONSTANTS.LABEL.ROLE_EDIT_DESC
    };
    steps= [];
    buttonName= ROLE_CONSTANTS.LABEL.ROLE_ACTION_EDIT;
    backUrl= ROLE_CONSTANTS.URL.ROLE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorRolename: false,
        duplicateErrorEmail: false
    };
    constructor(
    private route: ActivatedRoute,
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
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_LIST_LINK, ROLE_CONSTANTS.URL.ROLE_LIST, true);
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_EDIT_LINK, ROLE_CONSTANTS.URL.ROLE_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROLE_CONSTANTS.LABEL.ROLE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadRole(this.alias);
        });
    }

    ngOnInit() {

        this.roleForm = this.createRoleForm();

    }

    createRoleForm(): FormGroup {
          // this.selectedCity=this.role.address? this.role.address.city:{};
           return this.roleForm = this._formBuilder.group({
                   id                    : [this.role.id],
                   name                  : [this.role.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
                   description           : [this.role.description, [Validators.required, Validators.minLength(3)]],
           });
    }

    updateRole() {
        let roleObj = this.roleForm.value;
        $('body').addClass('loading');
        this.role.name = roleObj.name;
        this.role.description = roleObj.description;

        this.role.id = this.role.id;
        this.roleService.updateRole(this.role.alias, this.role)
        .subscribe(
        data => {
        $('body').removeClass('loading');
            if (data['hasError']) {
                // this.assignResponseError(data,form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
            this.loading = false;
        });

    }

    loadRole(alias) {
        this.roleService.getRole(alias)
        .subscribe(
        data => {
            this.role = data['data'][0];
            this.roleForm = this.createRoleForm();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
            this.loading = false;
        });

    }

    submitForm() {
        let role = this.roleForm.value;
        let city = role.city;
        if (city > 0) {
        } else {
            this.roleForm.get('city').setErrors({'required': true});
        }
    }


    list() {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
    }
}
