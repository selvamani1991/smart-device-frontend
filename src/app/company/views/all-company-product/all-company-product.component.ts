import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
import { CompanyProductService } from '../../services/company-product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'all-company-product.component.html'
})

export class AllCompanyProductComponent implements OnInit {
    company: any= {};
    client: any= {};
    companyProducts: any= [];
    currentUser=undefined;
    services= [];
    form: any= {};
    loading = false;
    active= false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
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
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private companyService: CompanyService,
                private authenticationService: AuthenticationService,
                private companyProductService: CompanyProductService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadCompanyProduct();
        this.loadClient();
    }

    loadCompanyProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyProductService.getAllCompanyProductLists(this.currentPage, this.pageSize, this.query)
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

    show(company) {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SHOW, company.alias]);
    }

    markDeleted(company) {
        this.sweetAlertService.deleteCheck(this, company);
    }

    reloadList() {
        this.loadCompanyProduct();
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(company) {
         this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_EDIT, company.alias]);
    }

    changeStatus(company, status) {
        company.active = status;
        this.companyService.updateCompany(company)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == COMPANY_CONSTANTS.FIELD.NAME) {
                form.form.controls[COMPANY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

   searchCompanyProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query=myModel;
            this.currentPage=1;
            this.loadCompanyProduct();
        }else {
            this.query='';
            this.loadCompanyProduct();
        }
   }

   changePassword(company) {
       this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_CHANGE_PASSWORD, company.alias]);
   }

   loadClient() {
       this.companyService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
          this.client = data['data'][0];
          this.breadCrumService.pushStep('All' + ' ' + this.client.companyNickName + ' ' + this.client.productNickName, COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
          this.steps = this.breadCrumService.getSteps();
       },
       () => {
          this.loading = false;
       });
   }
}
