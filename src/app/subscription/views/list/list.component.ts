import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { SubscriptionService } from '../../services/subscription.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    subscriptions: any = [];
    form: any= {};
    subscription: any= {};
    currentUser=undefined;
    subscriptionDetails: any= [];
    services= [];
    loading = false;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION,
        pageTitle: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST,
        pageDesc: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private subscriptionService: SubscriptionService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
       this.loadSubscription();
    }

    loadSubscription() {
        this.loading = true;
        $('body').addClass('loading');
        this.subscriptionService.getAllSubscriptions(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.subscriptions = data['data'];
                this.paginationItems = this.subscriptions;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                var reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                this.tooltipService.enable();
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadSubscription();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadSubscription();
    }

    addSubscription() {
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_CREATE]);
    }

    edit(subscription) {
        this.tooltipService.clear();
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_EDIT, subscription.alias]);
    }

    show(subscription) {
        this.tooltipService.clear();
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_SHOW, subscription.alias]);
    }

    markDeleted(subscription) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, subscription);
    }

    remove(subscription) {
        this.subscriptionService.deleteSubscription(subscription.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                subscription.isDeleted = true;
                subscription.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
                this.loadSubscription();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changeStatus(subscription, status) {
        subscription.active = status;
        this.subscriptionService.updateSubscription(subscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) { 
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == SUBSCRIPTION_CONSTANTS.FIELD.NAME) {
                form.form.controls[SUBSCRIPTION_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchSubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadSubscription();
        }else {
           this.query = '';
           this.loadSubscription();
        }
    }
}
