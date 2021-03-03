import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { CompanyProductService } from '../../services/company-product.service';
import { CompanyService } from '../../services/company.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'assigned-company-building-product.component.html'
})

export class AssignedCompanyBuildingProductComponent implements OnInit {
    currentUser: any= {};
    companyBuildingProducts: any= [];
    selectedProduct: any= {};
    client: any= {};
    selectedCompanyBuildingProduct: any= {id:''};
    services= [];
    loading = false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.ASSIGNED_COMPANY_BUILDING_PRODUCT,
        pageTitle: COMPANY_CONSTANTS.LABEL.ASSIGNED_COMPANY_BUILDING_PRODUCT_LIST,
        pageDesc: COMPANY_CONSTANTS.LABEL.ASSIGNED_COMPANY_BUILDING_PRODUCT_DESC
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
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_CONSTANTS.LABEL.COMPANY_BUILDING);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadAssignedCompanyBuildingProduct();
        this.loadClient();
    }

    loadAssignedCompanyBuildingProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyProductService.getAllAssignedCompanyBuildingProducts(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyBuildingProducts = data['data'];
            this.paginationItems = this.companyBuildingProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.companyBuildingProducts.length; i++) {
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
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadAssignedCompanyBuildingProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadAssignedCompanyBuildingProduct();
    }

    dispatchProduct(companyBuildingProduct) {
           this.selectedProduct = companyBuildingProduct.product;
    }

    reloadRoles() {
        this.loadAssignedCompanyBuildingProduct();
    }

    show(product) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_CONSTANTS.URL.PRODUCT_TELEMETRIC_DATA, product.alias]);
    }

    showErrorData(product) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_CONSTANTS.URL.PRODUCT_ERROR_DATA, product.alias]);
    }

    searchAssignedCompanyBuildingProduct(newValue) {
       var myModel = newValue;
       if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadAssignedCompanyBuildingProduct();
       }else {
           this.query = '';
           this.loadAssignedCompanyBuildingProduct();
       }
    }

    editCompanyBuilding(companyBuildingProduct) {
        this.tooltipService.clear();
        this.selectedCompanyBuildingProduct = {};
        this.selectedCompanyBuildingProduct = companyBuildingProduct;
        $('#editCompanyBuildingModal').modal('show');
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyBuildingNickName + ' ' + this.client.productNickName, COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
