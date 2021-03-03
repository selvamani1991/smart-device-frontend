import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { REPORT_CONSTANTS } from '../../../report/constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { CompanyBuildingProductService } from '../../services/company-building-product.service';
import { CompanyBuildingService } from '../../services/company-building.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'company-building-product.component.html'
})

export class CompanyBuildingProductComponent implements OnInit {
    companyBuildings: any = [];
    companyBuilding: any= {};
    currentUser: any= {};
    product: any= {};
    client: any= {};
    companyBuildingProducts: any= [];
    selectedProduct: any= {};
    services= [];
    loading = false;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    REPORT_CONSTANTS= REPORT_CONSTANTS;
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
                private authenticationService: AuthenticationService,
                private companyBuildingProductService: CompanyBuildingProductService,
                private companyBuildingService: CompanyBuildingService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.REPORT_CONSTANTS = REPORT_CONSTANTS;
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
        this.loadCompanyBuildingProduct();
        this.loadClient();
    }

    loadCompanyBuildingProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyBuildingProductService.getAllCompanyBuildingProducts(this.currentPage, this.pageSize, this.query)
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
            this.tooltipService.enable();
            for (let i = 0; i < this.companyBuildingProducts.length; i++) {

                if (this.companyBuildingProducts[i].acceptedDate && this.companyBuildingProducts[i].acceptedDate > 0 ) {
                    this.companyBuildingProducts[i].acceptedDate = this.dateService.getDateString(this.companyBuildingProducts[i].acceptedDate);
                }else {
                    this.companyBuildingProducts[i].acceptedDate = 'N/A';
                }

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
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT]);
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

    addCompanyBuilding() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_CREATE]);
    }

    dispatchProduct(companyBuildingProduct) {
           this.selectedProduct = companyBuildingProduct.product;
    }

    reloadRoles() {
        this.loadCompanyBuildingProduct();
    }

    show(product) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.PRODUCT_TELEMETRIC_DATA, product.alias]);
    }

    showErrorData(product) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.PRODUCT_ERROR_DATA, product.alias]);
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

    showCompanyBuildingProduct(companyBuildingProduct) {
        this.tooltipService.clear();
        this.router.navigate([REPORT_CONSTANTS.URL.REPORT_COMPANY_BUILDING, companyBuildingProduct.alias]);
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyBuildingNickName + ' ' + this.client.productNickName + ' ' + 'List', COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
