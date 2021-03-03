import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TELEMETRIC_DATA_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ErrorDataService } from '../../services/error-data.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ProductService} from '../../../product/services/product.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';
import { DateService } from '../../../shared/services/date.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'error-data.component.html'
})

export class ErrorDataComponent implements OnInit {
    errorDatas: any = [];
    errorData: any= {};
    form: any= {};
    client: any= {};
    consumerDevice: any= {};
    alias: any;
    product: any= {};
    productType: any= {};
    services= [];
    currentUser: any= {};
    processTime: any= {};
    loading = false;
    TELEMETRIC_DATA_CONSTANTS= TELEMETRIC_DATA_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS=PRODUCT_TYPE_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS=COMPANY_BUILDING_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA,
        pageTitle: TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST,
        pageDesc: TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private errorDataService: ErrorDataService,
                private productService: ProductService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private telemetricService: TelemetricService,
                private dateService: DateService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.TELEMETRIC_DATA_CONSTANTS = TELEMETRIC_DATA_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA);
        this.route.params.subscribe( params => {
               this.alias = params.alias;
               this.loadErrorData();
               this.loadProduct();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();

            }
        );
    }

    ngOnInit() {
        this.loadClient();
    }

    loadErrorData() {
        this.loading = true;
        $('body').addClass('loading');
        this.errorDataService.getAllErrorDatas(this.currentPage, this.pageSize, this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.errorDatas = data['data'];
            this.paginationItems = this.errorDatas;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (var i = 0; i < this.errorDatas.length; i++) {
                this.errorDatas[i].processTime = this.dateService.getDateTimeString(this.errorDatas[i].processTime);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    changePage(event) {
       this.currentPage = event;
       this.loadErrorData();
    }

    changePageSize(event) {
       this.pageSize = event;
       this.loadErrorData();
    }

    loadProduct() {
        var _self = this;
        this.productService.getProduct(this.alias)
        .subscribe(
        data => {
            this.product = data['data'][0];
            if(this.currentUser && this.currentUser.userType == 'Consumer'){
                this.breadCrumService.pushStep(PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_DEVICE_LIST_ALIAS.replace(":alias",this.consumerDevice.product.alias),true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            if(this.currentUser && this.currentUser.userType == 'clientAdmin'){
                this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.product.productType.alias),true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            if(this.currentUser && this.currentUser.userType == 'companyAdmin'){
                this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyBuildingNickName+ ' ' + this.client.productNickName, COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT,true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            if(this.currentUser && this.currentUser.userType == 'vendorAdmin'){
                if(this.telemetricService.getCurrentPage()=='distributor'){
                    this.breadCrumService.pushStep('Assigned' + ' ' + this.client.distributorNickName+ ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_DISTRIBUTOR_PRODUCT,true);
                    this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
                }
                if(this.telemetricService.getCurrentPage()=='company'){
                    this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName+ ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT,true);
                    this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
                }
            }
            if(this.currentUser && this.currentUser.userType == 'distributorAdmin'){
                this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName+ ' ' + this.client.productNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT,true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            if(this.currentUser && this.currentUser.userType == 'companyBuildingAdmin'){
                this.breadCrumService.pushStep(this.client.companyBuildingNickName+ ' ' + this.client.productNickName + ' ' + 'List', COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT,true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            if(this.currentUser && this.currentUser.userType == 'SuperAdmin'){
                 this.breadCrumService.pushStep(PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_DEVICE_LIST_ALIAS.replace(":alias",this.consumerDevice.product.alias),true);
                 this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.ERROR_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_ERROR_DATA, false);
            }
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadProduct();
        },
        () => {
            this.loading = false;
        });
    }
}
