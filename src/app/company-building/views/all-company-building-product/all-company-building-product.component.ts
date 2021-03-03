import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyBuildingProductService } from '../../services/company-building-product.service';
import { CompanyBuildingService } from '../../services/company-building.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'all-company-building-product.component.html'
})

export class AllCompanyBuildingProductComponent implements OnInit {
    companyBuilding: any= {};
    companyBuildingProducts: any= [];
    services= [];
    client: any= {};
    currentUser: any= {};
    form: any= {};
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
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private companyBuildingProductService: CompanyBuildingProductService,
                 private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private dateService: DateService,
                private companyBuildingService: CompanyBuildingService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
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
        });
    }

    ngOnInit() {
        this.loadCompanyBuildingProduct();
        this.loadClient();
    }

    loadCompanyBuildingProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyBuildingProductService.getAllCompanyBuildingProductLists(this.currentPage, this.pageSize,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyBuildingProducts = data['data'];
            this.paginationItems = this.companyBuildingProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.companyBuildingProducts.length; i++) {
                if (this.companyBuildingProducts[i].dispatchedDate && this.companyBuildingProducts[i].dispatchedDate > 0 ) {
                    this.companyBuildingProducts[i].dispatchedDate = this.dateService.getDateString(this.companyBuildingProducts[i].dispatchedDate);
                }else {
                    this.companyBuildingProducts[i].dispatchedDate = 'N/A';
                }

                if (this.companyBuildingProducts[i].acceptedDate && this.companyBuildingProducts[i].acceptedDate > 0 ) {
                     this.companyBuildingProducts[i].acceptedDate = this.dateService.getDateString(this.companyBuildingProducts[i].acceptedDate);
                }else {
                    this.companyBuildingProducts[i].acceptedDate = 'N/A';
                }
            }

        },
        error => {
            $('body').removeClass('loading');
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadCompanyBuildingProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadCompanyBuildingProduct();
    }

    show(companyBuilding) {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_SHOW, companyBuilding.alias]);
    }

    markDeleted(companyBuilding) {
        this.sweetAlertService.deleteCheck(this, companyBuilding);
    }

    reloadList() {
        this.loadCompanyBuildingProduct();
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(companyBuilding) {
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
                this.sweetAlertService.updateConfirmation(this.setting.entity);
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

    searchCompanyBuildingProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadCompanyBuildingProduct();
        } else {
            this.query = '';
            this.loadCompanyBuildingProduct();
        }
    }

    changePassword(companyBuilding) {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_CHANGE_PASSWORD, companyBuilding.alias]);
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('All' + ' ' + this.client.companyBuildingNickName + ' ' + this.client.productNickName, COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
