import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CONSUMER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ConsumerService } from '../../services/consumer.service';
import { ERROR_CODE } from '../../../constants';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'consumer-subscription-list.component.html'
})

export class ConsumerSubscriptionListComponent implements OnInit {
    form: any= {};
    consumer: any= {};
    consumerSubscriptions: any= [];
    services= [];
    loading = false;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_CONSTANTS.LABEL.CONSUMER,
        pageTitle: CONSUMER_CONSTANTS.LABEL.CONSUMER_CONSUMER_LIST,
        pageDesc: CONSUMER_CONSTANTS.LABEL.CONSUMER_CONSUMER_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    alias: any= {};
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private consumerService: ConsumerService,
                private alertService: AlertService,
                private tooltipService: TooltipService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_CONSTANTS.LABEL.CONSUMER_CONSUMER_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_LIST, true);
        breadCrumService.pushStep(CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTIONS, CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_SUBSCRIPTION_LIST, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_CONSTANTS.LABEL.CONSUMER);
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
        this.consumerService.getConsumerSubscription(this.currentPage, this.pageSize, this.query,this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerSubscriptions = data['data'];
            this.paginationItems = this.consumerSubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages =  reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.consumerSubscriptions.length; i++) {
                this.consumerSubscriptions[i].startDate = this.dateService.getDateString(this.consumerSubscriptions[i].startDate);
                this.consumerSubscriptions[i].endDate = this.dateService.getDateString(this.consumerSubscriptions[i].endDate);
            }

        },
        error => {
            $('body').removeClass('loading');
            if (error.error.error.errorCode === ERROR_CODE.code_5) {
                this.alertService.error('auth.view.accessDenied', true);
                this.router.navigate([APP_CONFIG.DASHBOARD]);
            }else {
                this.alertService.error('auth.view.accessDenied', true);
            }
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

    searchConsumerSubscriptionList(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadConsumerSubscriptions();
        } else {
            this.query = '';
            this.loadConsumerSubscriptions();
        }
    }

}