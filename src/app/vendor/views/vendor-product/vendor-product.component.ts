import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { REPORT_CONSTANTS } from '../../../report/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';
import { VendorService } from '../../services/vendor.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    selector: 'vendor-product.component',
    moduleId: module.id.toString(),
    templateUrl: 'vendor-product.component.html'
})

export class VendorProductComponent implements OnInit {
    vendorProducts: any = [];
    vendor: any= {};
    currentUser: any= {};
    client: any= {};
    dispatchDate: any;
    selectedProduct: any= {};
    services= [];
    alias: any= {};
    loading = false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    REPORT_CONSTANTS= REPORT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_VENDOR_PRODUCT,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_VENDOR_PRODUCT_DESC
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
                private sweetAlertService: SweetAlertService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.REPORT_CONSTANTS = REPORT_CONSTANTS;
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
        $('#dispatchDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.dispatchDate = selectedDate;
            }
        });
        this.telemetricService.setCurrentPage('vendorProduct');
    }

    loadVendorProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorProductService.getAllVendorProducts(this.currentPage, this.pageSize, this.query)
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

    vendorShow() {
        $('#vendorTypeModal').modal();
    }

    remove(vendor) {
        this.vendorService.deleteVendor(vendor.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                vendor.isDeleted = true;
                vendor.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
          this.alertService.error(error.message);
          this.loading = false;
        });
    }

    dispatchProduct(vendorProduct) {
        this.selectedProduct = vendorProduct.product;
        $('#distributorTypeModal').modal('show');
    }

    dispatchCompanyProduct(vendorProduct) {
       this.selectedProduct = vendorProduct.product;
       $('#companyTypeModal').modal('show');
    }

    changePage(event) {
       this.currentPage = event;
       this.loadVendorProducts();
    }

    changePageSize(event) {
       this.pageSize = event;
       this.loadVendorProducts();
    }

    reloadVendorProduct() {
        this.loadVendorProducts();
    }

    searchVendorProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadVendorProducts();
        }else {
           this.query = '';
           this.loadVendorProducts();
        }
    }

    showInvoice(vendorProduct) {
        this.router.navigate([INVOICE_CONSTANTS.URL.INVOICE_VENDOR_SHOW, vendorProduct.invoiceId]);
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + this.client.productNickName + ' ' + 'List', VENDOR_CONSTANTS.URL.VENDOR_VENDOR_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
