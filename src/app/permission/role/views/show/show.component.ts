import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FEATURE_CONSTANTS } from '../../../feature-category/constants';
import { ROLE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';

import { RoleService} from '../../services/role.service';

import { AlertService } from '../../../../shared/services/alert.service';
import { TooltipService } from '../../../../shared/services/tooltip.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'show.component.html'
})
export class ShowComponent implements OnInit {
    loading = false;
    role: any= {};
    roleFeature: any= {};
    featureCategories: any= [];
    roleForm: FormGroup;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
    entity: ROLE_CONSTANTS.LABEL.ROLE,
    pageTitle: ROLE_CONSTANTS.LABEL.ROLE_SHOW,
    pageDesc: ROLE_CONSTANTS.LABEL.ROLE_SHOW_DESC,
    assign: ROLE_CONSTANTS.LABEL.ROLE_ASSIGN
    };
    subSetting = {
    entity: FEATURE_CONSTANTS.LABEL.FEATURE
    };

    steps= [];
    backUrl= ROLE_CONSTANTS.URL.ROLE_LIST;
    alias: any= {};
    formValidation= {
    duplicateErrorRoleName: false,
    };

    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private roleService: RoleService,
                private alertService: AlertService,
                private tooltipService: TooltipService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.ROLE_CONSTANTS = ROLE_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_LIST_LINK, ROLE_CONSTANTS.URL.ROLE_LIST, true);
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_SHOW_LINK, ROLE_CONSTANTS.URL.ROLE_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROLE_CONSTANTS.LABEL.ROLE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadRole(this.alias);
            this.loadFeatureCategories();
        });
    }
    ngOnInit() {
        this.tooltipService.enable();
    }
    createRoleForm(): FormGroup {
        return this.roleForm = this._formBuilder.group({
            id              : [this.role.id],
            name            : [this.role.name, []],
            description     : [this.role.description, [Validators.required, Validators.minLength(3)]],


        });
    }

    loadRole(alias) {
        this.roleService.getRole(alias)
        .subscribe(
        data => {
            this.role = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        }
        );
    }

    loadFeatureCategories() {
        this.loading = true;
        this.roleService.featureCategories()
        .subscribe(
        data => {
            this.featureCategories = data['data'];
            this.loading = false;
            this.tooltipService.enable();
        },
        error => {
            if (error.error.error.errorCode === ERROR_CODE.code_5) {
                this.alertService.error('auth.view.accessDenied', true);
                this.router.navigate([APP_CONFIG.DASHBOARD]);
            }else {
                this.alertService.error('auth.view.accessDenied', true);
            }
        });
    }

    assignFeaturePage(role) {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_ASSIGN, role.alias]);
    }

    markDeleted(role) {
        this.sweetAlertService.deleteCheck(this, role);
    }

    markFeatureDeleted(roleFeature) {
        this.sweetAlertService.deleteCheck(this, roleFeature);
    }

    remove(object) {
        if (object.roleFeatures) {
            this.tooltipService.clear();
            this.roleService.deleteRole(object.id)
            .subscribe(
            data => {
                if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                    this.sweetAlertService.deleteConfirmation(this.setting.entity);
                    this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
                } else {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                    this.tooltipService.enable();
                }
            },
            error => {
                this.alertService.error(error.message);
                this.loading = false;
            });
        }else {
            object.deleted = true;
            this.updateRole();
        }
    }

    edit() {
        $('#formModal').modal();
    }
    updateRole() {
        this.loading = true;
        this.tooltipService.clear();
        this.roleService.updateRole(this.role.alias, this.role)
        .subscribe(
        data => {
            if (data['hasError']) {

            }else {
                this.role = data['data'][0];
                $('#formModal').modal('hide');
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.tooltipService.enable();
            }
            this.loading = false;
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        });
    }

    changeStatus(role) {
        this.role = role;
        this.role.active = !this.role.active;
        this.updateRole();
    }


    addRoleFeature() {
        this.roleFeature = {};
        $('#featureModal').modal();
    }

    editRoleFeature(roleFeature) {
        this.roleFeature = roleFeature;
        this.roleFeature.crud = this.roleFeature.createRight && this.roleFeature.readRight && this.roleFeature.updateRight && this.roleFeature.deleteRight;
        $('#featureModal').modal();
    }

    updateRoleFeature() {
        delete this.roleFeature.crud;
        $('#featureModal').modal('hide');
        this.updateRole();
    }

}
