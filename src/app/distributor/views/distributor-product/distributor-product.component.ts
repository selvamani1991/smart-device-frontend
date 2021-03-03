import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorProductService } from '../../services/distributor-product.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';
import { DistributorService } from '../../services/distributor.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'distributor-product.component.html'
})

export class DistributorProductComponent implements OnInit {
    distributors: any = [];
    distributorProducts: any = [];
    distributor: any= {};
    client: any= {};
    currentUser: any= {};
    selectedProduct= {};
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
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_DISTRIBUTOR_PRODUCT,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_DISTRIBUTOR_PRODUCT_DESC
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
                private distributorProductService: DistributorProductService,
                private distributorService: DistributorService,
                private alertService: AlertService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
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
        this.loadDistributorProduct();
        this.loadClient();
        this.telemetricService.setCurrentPage('distributorProduct');
    }

    loadDistributorProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorProductService.getAllDistributorProducts(this.currentPage, this.pageSize, this.query)
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

                if (this.distributorProducts[i].acceptedDate && this.distributorProducts[i].acceptedDate > 0 ) {
                    this.distributorProducts[i].acceptedDate = this.dateService.getDateString(this.distributorProducts[i].acceptedDate);
                }else {
                    this.distributorProducts[i].acceptedDate = 'N/A';
                }
            }

        },
        error => {
            $('body').removeClass('loading');
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    distributorShow() {
        $('#distributorTypeModal').modal();
    }

    remove(distributor) {
        this.distributorService.deleteDistributor(distributor.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
            distributor.isDeleted = true;
            distributor.isActive = false;
            this.sweetAlertService.deleteConfirmation(this.setting.entity);
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    dispatchProduct(distributorProduct) {
        this.selectedProduct = distributorProduct.product;
        $('#companyTypeModal').modal('show');
    }

    changePage(event) {
        this.currentPage = event;
        this.loadDistributorProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadDistributorProduct();
    }

    reloadDistributorProduct() {
        this.loadDistributorProduct();
    }

    searchDistributorProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadDistributorProduct();
        } else {
            this.query = '';
            this.loadDistributorProduct();
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
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + this.client.productNickName + ' ' + 'List ', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

}
