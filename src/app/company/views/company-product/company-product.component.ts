import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { CompanyProductService } from '../../services/company-product.service';
import { CompanyService } from '../../services/company.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'company-product.component.html'
})

export class CompanyProductComponent implements OnInit {
    companys: any = [];
    company: any= {};
    client: any= {};
    currentUser: any= {};
    companyProducts: any= [];
    selectedProduct: any= {};
    services= [];
    loading = false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_LIST,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_LIST_DESC
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
                private companyProductService: CompanyProductService,
                private companyService: CompanyService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();

            }
        );
    }

    ngOnInit() {
        this.loadCompanyProduct();
        this.loadClient();
        this.telemetricService.setCurrentPage('companyProduct');
    }

    loadCompanyProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyProductService.getAllCompanyProducts(this.currentPage, this.pageSize, this.query)
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
                }else {
                    this.companyProducts[i].dispatchedDate = 'N/A';
                }

                if (this.companyProducts[i].acceptedDate && this.companyProducts[i].acceptedDate > 0 ) {
                    this.companyProducts[i].acceptedDate = this.dateService.getDateString(this.companyProducts[i].acceptedDate);
                }else {
                    this.companyProducts[i].acceptedDate = 'N/A';
                }
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadCompanyProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadCompanyProduct();
    }

    addCompany() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_CREATE]);
    }

    dispatchProduct(companyProduct) {
        this.selectedProduct = companyProduct.product;
        $('#companyBuildingModal').modal('show');
    }

    reloadRoles() {
        this.loadCompanyProduct();
    }

    searchCompanyProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadCompanyProduct();
        }else {
            this.query = '';
            this.loadCompanyProduct();
        }
    }

    showInvoice(companyProduct) {
        this.router.navigate([INVOICE_CONSTANTS.URL.INVOICE_COMPANY_SHOW, companyProduct.invoiceId]);
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + this.client.productNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_COMPANY_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
