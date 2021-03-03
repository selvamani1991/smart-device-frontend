import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { VendorService } from '../../services/vendor.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'assigned-company-product.component.html'
})

export class AssignedCompanyProductComponent implements OnInit {
    companyProducts: any = [];
    company: any= {};
    client: any= {};
    currentUser: any= {};
    selectedProduct= {};
    services= [];
    loading = false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.ASSIGNED_COMPANY,
        pageTitle: VENDOR_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT,
        pageDesc: VENDOR_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT_DESC
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
                private vendorProductService: VendorProductService,
                private vendorService: VendorService,
                private alertService: AlertService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        }
        );
    }

    ngOnInit() {
        this.loadAssignedCompanyProduct();
        this.loadClient();
        this.telemetricService.setCurrentPage('company');
    }

    loadAssignedCompanyProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorProductService.getAllAssignedCompanyProducts(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyProducts = data['data'];
            this.paginationItems = this.companyProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.companyProducts.length; i++) {
                if (this.companyProducts[i].dispatchedDate && this.companyProducts[i].dispatchedDate > 0 ) {
                    this.companyProducts[i].dispatchedDate = this.dateService.getDateString(this.companyProducts[i].dispatchedDate);
                }else{
                    this.companyProducts[i].dispatchedDate = 'N/A';
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
       this.loadAssignedCompanyProduct();
    }

    changePageSize(event) {
       this.pageSize = event;
       this.loadAssignedCompanyProduct();
    }

    searchAssignedCompanyProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadAssignedCompanyProduct();
        }else {
        this.query = '';
           this.loadAssignedCompanyProduct();
        }
    }

    show(product) {
        this.router.navigate([VENDOR_CONSTANTS.URL.PRODUCT_TELEMETRIC_DATA, product.alias]);
    }

    showErrorData(product) {
        this.router.navigate([VENDOR_CONSTANTS.URL.PRODUCT_ERROR_DATA, product.alias]);
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName + ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
