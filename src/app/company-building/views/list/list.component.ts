import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyBuildingService } from '../../services/company-building.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    companyBuildings: any = [];
    users= [];
    companyBuilding: any= {};
    companyBuildingDetails: any= [];
    services= [];
    client: any= {};
    currentUser=undefined;
    form: any= {};
    alias: any= {};
    loading = false;
    active= false;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING,
        pageTitle: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_LIST,
        pageDesc: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private companyBuildingService: CompanyBuildingService,
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.loadCompanyBuilding();
        this.loadClient();
    }

    loadCompanyBuilding() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyBuildingService.getAllCompanyBuildings(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyBuildings = data['data'];
            this.paginationItems = this.companyBuildings;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();

        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadCompanyBuilding();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadCompanyBuilding();
    }

    addCompanyBuilding() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_CREATE]);
    }

    show(companyBuilding) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_SHOW, companyBuilding.alias]);
    }

    markDeleted(companyBuilding) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, companyBuilding);
    }

    reloadList() {
        this.loadCompanyBuilding();
    }

    remove(companyBuilding) {
        this.companyBuildingService.deleteCompanyBuilding(companyBuilding.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.client.companyBuildingNickName);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
                this.loadCompanyBuilding();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(companyBuilding) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_EDIT, companyBuilding.alias]);
    }

    changeStatus(companyBuilding, status) {
        companyBuilding.active = status;
        this.companyBuildingService.updateCompanyBuilding(companyBuilding)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyBuildingNickName);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === COMPANY_BUILDING_CONSTANTS.FIELD.NAME) {
                form.form.controls[COMPANY_BUILDING_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchCompanyBuilding(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadCompanyBuilding();
        } else {
            this.query = '';
            this.loadCompanyBuilding();
        }
    }

    changePassword(companyBuilding) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_CHANGE_PASSWORD, companyBuilding.alias]);
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.companyBuildingNickName + ' ' + 'List', COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST, true);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
