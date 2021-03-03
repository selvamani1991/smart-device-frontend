import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ROLE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';

import { RoleService } from '../../services/role.service';

import { AlertService } from '../../../../shared/services/alert.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    roles: any = [];
    role: any = {};
    form: any= {};
    loading = false;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: ROLE_CONSTANTS.LABEL.ROLE,
        pageTitle: ROLE_CONSTANTS.LABEL.ROLE_LIST,
        pageDesc: ROLE_CONSTANTS.LABEL.ROLE_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
    private router: Router,
    private roleService: RoleService,
    private alertService: AlertService,
    // private tooltipService: TooltipService,
    private httpResponseService: HttpResponseService,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ROLE_CONSTANTS = ROLE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(ROLE_CONSTANTS.LABEL.ROLE_LIST_LINK, ROLE_CONSTANTS.URL.ROLE_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROLE_CONSTANTS.LABEL.ROLE);
    }

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.loading = true;
        $('body').addClass('loading');
        this.roleService.getAllRole(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.roles = data['data'];
            this.paginationItems = this.roles;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages =  reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadRoles();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadRoles();
    }

    show(role) {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_SHOW, role.alias]);
    }
    edit(role) {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_EDIT, role.alias]);
    }

    assignFeaturePage(role) {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_ASSIGN, role.alias]);
    }

    addNew() {
        this.role = {};
        $('#formModal').modal();
    }

    addRole() {
        this.router.navigate([ROLE_CONSTANTS.URL.ROLE_CREATE]);
    }

    reloadRoles() {
        this.loadRoles();
    }

    searchRole(newValue) {
        let myModel = newValue;
        if (myModel.length > 2) {
            this.roleService.search(myModel, this.currentPage, this.pageSize)
            .subscribe(
            data => {
                this.roles = data['data'];
                this.paginationItems = this.roles;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                let reminder = this.totalSize % this.pageSize;
                this.totalPages =  reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
            });
        }
    }

    markDeleted(role) {
        this.sweetAlertService.deleteCheck(this, role);
    }

    markFeatureDeleted(roleFeature) {
        this.sweetAlertService.deleteCheck(this, roleFeature);
    }

    remove(object) {
        $('body').addClass('loading');
        if (object.roleFeatures) {
            // this.tooltipService.clear();
            this.roleService.deleteRole(object.id)
            .subscribe(
            data => {
                $('body').removeClass('loading');
                if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                    this.sweetAlertService.deleteConfirmation(this.setting.entity);
                    this.router.navigate([ROLE_CONSTANTS.URL.ROLE_LIST]);
                    this.loadRoles();
                } else {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                    // this.tooltipService.enable();
                }
            },
            error => {
                $('body').removeClass('loading');
                this.alertService.error(error.message);
                this.loading = false;
            });
        }else {
            object.deleted = true;
            this.updateRole();
        }
    }

    updateRole() {
        this.loading = true;
         $('body').addClass('loading');
        // this.tooltipService.clear();
        this.roleService.updateRole(this.role.alias, this.role)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {

            }else {
                this.role = data['data'][0];
                $('#formModal').modal('hide');
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                // this.tooltipService.enable();
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        });
    }

    changeStatus(role, status) {
        role.active = status;
         $('body').addClass('loading');
        this.roleService.updateRole(this.role.alias, this.role)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
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

    assignResponseError(data, form) {
         if (data.error.errorCode === ERROR_CODE.code_14 ) {
             if (data.error.errorField === ROLE_CONSTANTS.FIELD.NAME) {
                 form.form.controls[ROLE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
             }
         }
    }

}
