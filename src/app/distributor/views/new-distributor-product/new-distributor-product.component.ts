import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorProductService } from '../../services/distributor-product.service';
import { DistributorService } from '../../services/distributor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'new-distributor-product.component.html'
})

export class NewDistributorProductComponent implements OnInit {
    distributors: any = [];
    users= [];
    distributor: any= {};
    form: any= {};
    client: any= {};
    currentUser=undefined;
    distributorDetails: any= [];
    distributorProducts: any= [];
    product: any= [];
    selectedProduct: any= {};
    distributorProduct: any= {};
    services= [];
    loading = false;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_LIST,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private distributorProductService: DistributorProductService,
                private distributorService: DistributorService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        this.loadNewDistributorProduct();
        this.loadClient();
        this.telemetricService.setCurrentPage('NewProduct');
    }

    loadNewDistributorProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorProductService.getDistributorProduct(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributorProducts = data['data'];
            this.paginationItems = this.distributorProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.distributorProducts.length; i++) {
               if (this.distributorProducts[i].dispatchedDate && this.distributorProducts[i].dispatchedDate > 0 ) {
                    this.distributorProducts[i].dispatchedDate = this.dateService.getDateString(this.distributorProducts[i].dispatchedDate);
               }else {
                    this.distributorProducts[i].dispatchedDate = 'N/A';
               }
            }

        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT]);
            this.loading = false;
        });

    }

    changePage(event) {
        this.currentPage = event;
        this.loadNewDistributorProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadNewDistributorProduct();
    }

    acceptProduct(distributorProduct) {
        distributorProduct.status = 'Accepted';
        $('body').addClass('loading');
        distributorProduct.dispatchedDate = this.dateService.getLongFromString(distributorProduct.dispatchedDate);
        this.distributorProductService.updateDistributorProduct(distributorProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.distributorNickName + ' ' + this.client.productNickName);
                this.loadNewDistributorProduct();
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == DISTRIBUTOR_CONSTANTS.FIELD.NAME) {
                form.form.controls[DISTRIBUTOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchNewDistributorProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadNewDistributorProduct();
        } else {
            this.query = '';
            this.loadNewDistributorProduct();
        }
    }

    showInvoice(distributorProduct) {
        this.router.navigate([INVOICE_CONSTANTS.URL.INVOICE_DISTRIBUTOR_SHOW, distributorProduct.invoiceId]);
    }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('New' + ' ' + this.client.companyNickName + ' ' + this.client.productNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
