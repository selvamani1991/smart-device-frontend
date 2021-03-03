import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyBuildingService } from '../../services/company-building.service';
import { CompanyBuildingProductService } from '../../services/company-building-product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'new-company-building-product.component.html'
})

export class NewCompanyBuildingProductComponent implements OnInit {
    companyBuildings: any = [];
    users= [];
    companyBuilding: any= {};
    client: any= {};
    currentUser: any= {};
    form: any= {};
    product: any= {};
    companyBuildingDetails: any= [];
    companyBuildingProducts: any= [];
    selectedProduct: any= {};
    companyBuildingProduct: any= {};
    services= [];
    loading = false;
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
    alias:any;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private companyBuildingService: CompanyBuildingService,
                private authenticationService: AuthenticationService,
                private companyBuildingProductService: CompanyBuildingProductService,
                private dateService: DateService,
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
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        this.loadNewCompanyBuildingProduct();
        this.loadClient();
    }

    loadNewCompanyBuildingProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyBuildingService.getCompanyBuildingProduct(this.currentPage, this.pageSize, this.query)
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
            }

        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT]);
            this.loading = false;
        });

    }

    changePage(event) {
        this.currentPage = event;
        this.loadNewCompanyBuildingProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadNewCompanyBuildingProduct();
    }

    acceptProduct(companyBuildingProduct) {
        companyBuildingProduct.status = 'Accepted';
        companyBuildingProduct.dispatchedDate = this.dateService.getLongFromString(companyBuildingProduct.dispatchedDate);
        this.companyBuildingProductService.updateCompanyBuildingProduct(companyBuildingProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyBuildingNickName + ' ' + this.client.productNickName);
                this.loadNewCompanyBuildingProduct();
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === COMPANY_BUILDING_CONSTANTS.FIELD.COMPANY_BUILDING_NAME) {
                form.form.controls[COMPANY_BUILDING_CONSTANTS.FIELD.COMPANY_BUILDING_NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchNewCompanyBuildingProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadNewCompanyBuildingProduct();
        } else {
            this.query = '';
            this.loadNewCompanyBuildingProduct();
        }
    }

    rejectProduct(companyBuildingProduct) {
        companyBuildingProduct.status = 'Rejected';
        companyBuildingProduct.dispatchedDate = this.dateService.getLongFromString(companyBuildingProduct.dispatchedDate);
        this.companyBuildingProductService.rejectCompanyBuildingProduct(companyBuildingProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyBuildingNickName + ' '+ this.client.productNickName);
                this.loadNewCompanyBuildingProduct();
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT]);
            this.loading = false;
        });
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('New' + ' ' + this.client.companyBuildingNickName + ' ' + this.client.productNickName, COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
