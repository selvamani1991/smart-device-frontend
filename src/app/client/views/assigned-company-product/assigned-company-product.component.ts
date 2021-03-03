import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ClientProductService } from '../../services/client-product.service';
import { ClientService } from '../../services/client.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'assigned-company-product.component.html'
})

export class AssignedCompanyProductComponent implements OnInit {
    companys: any = [];
    company: any= {};
    client: any= {};
    currentUser: any= {};
    companyProducts: any= [];
    services= [];
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT,
        pageTitle: CLIENT_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.ASSIGNED_COMPANY_PRODUCT_LIST_DESC
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
                private clientProductService: ClientProductService,
                private clientService: ClientService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
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
        this.clientProductService.getAllAssignedCompanyProducts(this.currentPage, this.pageSize, this.query)
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

            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_ASSIGNED_COMPANY_PRODUCT]);
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

    loadClient() {
        this.clientService.getClients(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName + ' ' + this.client.productNickName, CLIENT_CONSTANTS.URL.CLIENT_ASSIGNED_COMPANY_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
