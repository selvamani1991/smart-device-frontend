import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    companys: any = [];
    company: any= {};
    services= [];
    form: any= {};
    client: any= {};
    loading = false;
    active= false;
    currentUser=undefined;
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
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
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
        this.loadCompany();
        this.loadClient();
    }

    loadCompany() {
        this.loading = true;
         $('body').addClass('loading');
        this.companyService.getAllCompanys(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companys = data['data'];
            this.paginationItems = this.companys;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

            this.tooltipService.enable();
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadCompany();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadCompany();
    }

    addCompany() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_CREATE]);
    }

    show(company) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SHOW, company.alias]);
    }

    markDeleted(company) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, company);
    }

    reloadList() {
        this.loadCompany();
    }

    remove(company) {
        this.companyService.deleteCompany(company.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.client.companyNickName);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
                this.loadCompany();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(company) {
        this.tooltipService.clear();
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
                this.sweetAlertService.updateConfirmation(this.client.companyNickName);
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

    searchCompany(newValue) {
         var myModel = newValue;
         if (myModel.length > 1) {
             this.query = myModel;
             this.currentPage=1;
             this.loadCompany();
         }else {
             this.query = '';
             this.loadCompany();
         }
    }

    changePassword(company) {
         this.tooltipService.clear();
         this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_CHANGE_PASSWORD, company.alias]);
    }

    showCompanySubscription(company) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, company.alias]);
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    replaceText(text){
        text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
        return text;

    }
}
