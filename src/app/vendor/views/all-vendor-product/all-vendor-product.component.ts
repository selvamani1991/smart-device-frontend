import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { VendorService } from '../../services/vendor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'all-vendor-product.component.html'
})

export class AllVendorProductComponent implements OnInit {
    vendor: any= {};
    vendorProducts: any= [];
    services= [];
    currentUser: any= {};
    form: any= {};
    client: any= {};
    loading = false;
    active= false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_LIST,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private vendorProductService: VendorProductService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private dateService: DateService,
                private vendorService: VendorService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
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
        this.loadVendorProducts();
        this.loadClient();

    }

    loadVendorProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorProductService.getAllVendorProductLists(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.vendorProducts = data['data'];
            this.paginationItems = this.vendorProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.vendorProducts.length; i++) {
                if (this.vendorProducts[i].dispatchedDate && this.vendorProducts[i].dispatchedDate > 0 ) {
                   this.vendorProducts[i].dispatchedDate = this.dateService.getDateString(this.vendorProducts[i].dispatchedDate);
                }else {
                   this.vendorProducts[i].dispatchedDate = 'N/A';
                }

                if (this.vendorProducts[i].acceptedDate && this.vendorProducts[i].acceptedDate > 0 ) {
                   this.vendorProducts[i].acceptedDate = this.dateService.getDateString(this.vendorProducts[i].acceptedDate);
                }else {
                    this.vendorProducts[i].acceptedDate = 'N/A';
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
        this.loadVendorProducts();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadVendorProducts();
    }

    show(vendor) {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_SHOW, vendor.alias]);
    }

    markDeleted(vendor) {
        this.sweetAlertService.deleteCheck(this, vendor);
    }

    reloadList() {
        this.loadVendorProducts();
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(vendor) {
         this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_EDIT, vendor.alias]);
    }

    changeStatus(vendor, status) {
        vendor.active = status;
        this.vendorService.updateVendor(vendor)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == VENDOR_CONSTANTS.FIELD.NAME) {
                form.form.controls[VENDOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchVendor(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query=myModel;
            this.currentPage=1;
            this.loadVendorProducts();
        }else {
             this.query='';
             this.loadVendorProducts();
        }
    }

    changePassword(vendor) {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_CHANGE_PASSWORD, vendor.alias]);
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('All' + ' ' + this.client.vendorNickName + ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
