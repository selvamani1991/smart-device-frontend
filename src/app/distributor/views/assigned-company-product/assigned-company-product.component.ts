import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { DistributorProductService } from '../../services/distributor-product.service';
import { DistributorService } from '../../services/distributor.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'assigned-company-product.component.html'
})

export class AssignedCompanyProductComponent implements OnInit {
    companys: any = [];
    company: any= {};
    product: any= {};
    currentUser: any= {};
    client: any= {};
    companyProducts: any= [];
    selectedProduct: any= {};
    services= [];
    loading = false;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT_LIST,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT_LIST_DESC
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
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();

            }
        );
    }

    ngOnInit() {
        this.loadAssignedCompanyProduct();
        this.loadClient();
    }

    loadAssignedCompanyProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorProductService.getAllAssignedCompanyProducts(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyProducts = data['data'];
            this.paginationItems = this.companyProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.companyProducts.length; i++) {
                if (this.companyProducts[i].dispatchedDate && this.companyProducts[i].dispatchedDate > 0 ) {
                    this.companyProducts[i].dispatchedDate = this.dateService.getDateString(this.companyProducts[i].dispatchedDate);
                }else {
                    this.companyProducts[i].dispatchedDate = 'N/A';
                }
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT]);
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

    reloadRoles() {
        this.loadAssignedCompanyProduct();
    }

    show(product) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.PRODUCT_TELEMETRIC_DATA, product.alias]);
    }

    showErrorData(product) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.PRODUCT_ERROR_DATA, product.alias]);
    }

    searchAssignedCompanyProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadAssignedCompanyProduct();
        } else {
            this.query = '';
            this.loadAssignedCompanyProduct();
        }
    }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName + ' ' + this.client.productNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
