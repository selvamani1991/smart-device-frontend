import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { ConsumerSubscriptionService } from '../../services/consumer-subscription.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { USER_CONSTANTS } from '../../../user/constants';
declare var $: any;
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    consumerSubscriptions: any = [];
    users= [];
    consumerSubscription: any= {};
    admin: any= {};
    alias: any= {};
    form: any= {};
    consumerSubscriptionDetails: any= [];
    services= [];
    loading = false;
    CONSUMER_SUBSCRIPTION_CONSTANTS= CONSUMER_SUBSCRIPTION_CONSTANTS;
    USER_CONSTANTS= USER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION,
        pageTitle: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_LIST,
        pageDesc: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
    private router: Router,
    private route: ActivatedRoute,
    private consumerSubscriptionService: ConsumerSubscriptionService,
    private alertService: AlertService,
    private dateService: DateService,
    private breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private httpResponseService: HttpResponseService,
    private tooltipService: TooltipService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CONSUMER_SUBSCRIPTION_CONSTANTS = CONSUMER_SUBSCRIPTION_CONSTANTS;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_LIST_LINK, CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadConsumerSubscriptions();
    }

    loadConsumerSubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.consumerSubscriptionService.getAllConsumerSubscriptions(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerSubscriptions = data['data'];
            this.paginationItems = this.consumerSubscriptions;
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
            this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
           this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadConsumerSubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadConsumerSubscriptions();
    }

    addConsumerSubscription() {
        this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_CREATE]);
    }

    edit(consumerSubscription) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_EDIT, consumerSubscription.alias]);
    }

    show(consumerSubscription) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_SHOW, consumerSubscription.alias]);
    }

    markDeleted(consumerSubscription) {
        this.sweetAlertService.deleteCheck(this, consumerSubscription);
    }

    remove(consumerSubscription) {
        this.consumerSubscriptionService.deleteConsumerSubscription(consumerSubscription.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                consumerSubscription.isDeleted = true;
                consumerSubscription.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
                this.loadConsumerSubscriptions();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    reloadList() {
        this.loadConsumerSubscriptions();
    }

    changeStatus(consumerSubscription, status) {
        consumerSubscription.active = status;
        this.consumerSubscriptionService.updateConsumerSubscription(consumerSubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CONSUMER_SUBSCRIPTION_CONSTANTS.FIELD.NAME) {
                form.form.controls[CONSUMER_SUBSCRIPTION_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchConsumerSubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadConsumerSubscriptions();
        }else {
            this.query = '';
            this.loadConsumerSubscriptions();
        }
    }
}
