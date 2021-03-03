import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorService } from '../../services/vendor.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'new-vendor-product.component.html'
})

export class NewVendorProductComponent implements OnInit {
    vendor: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    currentUser=undefined;
    vendorProducts: any= [];
    product: any= [];
    dispatchDate: any;
    selectedProduct: any= {};
    vendorProduct: any= {};
    invoice: any= {};
    services= [];
    loading = false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
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
    totalPages= 0;
    query= '';

    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private vendorProductService: VendorProductService,
                private vendorService: VendorService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        }
        );
    }

    ngOnInit() {
        this.loadNewVendorProduct();
        $('#dispatchDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.dispatchDate = selectedDate;
             }
        });
        this.loadClient();
        this.telemetricService.setCurrentPage('NewProduct');
    }

    loadNewVendorProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorProductService.getVendorProduct(this.currentPage, this.pageSize, this.query)
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
                }else{
                    this.vendorProducts[i].dispatchedDate = 'N/A';
                }
            }



        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
            this.loading = false;
        });

    }

    changePage(event) {
        this.currentPage = event;
        this.loadNewVendorProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadNewVendorProduct();
    }

    acceptProduct(vendorProduct) {
        vendorProduct.status = 'Accepted';
        vendorProduct.dispatchedDate = this.dateService.getLongFromString(vendorProduct.dispatchedDate);
        this.vendorProductService.updateVendorProduct(vendorProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.vendorNickName + ' ' + this.client.productNickName);
                this.loadNewVendorProduct();
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
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

    searchNewVendorProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadNewVendorProduct();
        }else {
            this.query = '';
            this.loadNewVendorProduct();
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
           this.breadCrumService.pushStep('New' + ' ' + this.client.vendorNickName + ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
