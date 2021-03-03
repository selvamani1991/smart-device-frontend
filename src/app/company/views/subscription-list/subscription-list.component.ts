import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { CompanyService } from '../../services/company.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'subscription-list.component.html'
})

export class SubscriptionListComponent implements OnInit {
    companySubscriptions: any= [];
    companySubscription: any= {};
    alias: any= {};
    company: any= {};
    client: any= {};
    currentUser=undefined;
    form: any= {};
    services= [];
    loading = false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION_LIST,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION_LIST_DESC
    };
    steps= [];
    startDates= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private companyService: CompanyService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private tooltipService: TooltipService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompany(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadCompanySubscriptions();
        this.loadClient();
    }

    loadCompanySubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.companyService.getCompanySubscription(this.currentPage, this.pageSize, this.alias,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companySubscriptions = data['data'];
            this.paginationItems = this.companySubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.companySubscriptions.length; i++) {
                this.companySubscriptions[i].startDate = this.dateService.getDateString(this.companySubscriptions[i].startDate);
                this.companySubscriptions[i].endDate = this.dateService.getDateString(this.companySubscriptions[i].endDate);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadCompany(alias) {
        this.companyService.getCompany(this.alias)
        .subscribe(
        data => {
            this.company = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadCompanySubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadCompanySubscriptions();
    }

    searchCompanySubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadCompanySubscriptions();
        }else {
            this.query = '';
            this.loadCompanySubscriptions();
        }
    }

    addCompanySubscription() {
        $('#companySubscriptionModal').modal('show');
    }

    changeStatus(companySubscription, status) {
        companySubscription.active = status;
        companySubscription.startDate = this.dateService.getLongFromString(companySubscription.startDate);
        companySubscription.endDate = this.dateService.getLongFromString(companySubscription.endDate);
        this.companyService.updateCompanySubscription(companySubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                companySubscription.startDate = this.dateService.getDateString(companySubscription.startDate);
                companySubscription.endDate = this.dateService.getDateString(companySubscription.endDate);
                this.sweetAlertService.updateConfirmation(this.client.companyNickName + ' ' + 'Subscription');
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.company.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.company.alias]);
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

    edit(companySubscription) {
        this.tooltipService.clear();
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_EDIT, companySubscription.alias]);
    }

    reloadCompanySubscription(event) {
        this.loadCompanySubscriptions();
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'Subscription List', COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
