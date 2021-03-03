import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorService } from '../../services/distributor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'distributor-subscription-list.component.html'
})

export class DistributorSubscriptionListComponent implements OnInit {
    distributorSubscriptions: any= [];
    distributorSubscription: any= {};
    alias: any= {};
    client: any= {};
    currentUser=undefined;
    distributor: any= {};
    form: any= {};
    services= [];
    loading = false;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_LIST,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_LIST_DESC
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
                private distributorService: DistributorService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadDistributor();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadDistributorSubscriptions();
        this.loadClient();
    }

    loadDistributorSubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorService.getDistributorSubscription(this.currentPage, this.pageSize, this.alias,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributorSubscriptions = data['data'];
            this.paginationItems = this.distributorSubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.distributorSubscriptions.length; i++) {
                this.distributorSubscriptions[i].startDate = this.dateService.getDateString(this.distributorSubscriptions[i].startDate);
                this.distributorSubscriptions[i].endDate = this.dateService.getDateString(this.distributorSubscriptions[i].endDate);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadDistributor() {
        this.distributorService.getDistributor(this.alias)
        .subscribe(
        data => {
            this.distributor = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadDistributorSubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadDistributorSubscriptions();
    }

    searchDistributorSubscription(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadDistributorSubscriptions();
        } else {
            this.query = '';
            this.loadDistributorSubscriptions();
        }
    }

    addDistributorSubscription() {
        $('#distributorSubscriptionModal').modal('show');
    }

    reloadDistributorSubscription() {
        this.loadDistributorSubscriptions();
    }

    edit(distributorSubscription) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_EDIT, distributorSubscription.alias]);
    }

    changeStatus(distributorSubscription, status) {
        distributorSubscription.active = status;
        distributorSubscription.startDate = this.dateService.getLongFromString(distributorSubscription.startDate);
        distributorSubscription.endDate = this.dateService.getLongFromString(distributorSubscription.endDate);
        this.distributorService.updateDistributorSubscription(distributorSubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                distributorSubscription.startDate = this.dateService.getDateString(distributorSubscription.startDate);
                distributorSubscription.endDate = this.dateService.getDateString(distributorSubscription.endDate);
                this.sweetAlertService.updateConfirmation(this.client.distributorNickName + ' ' + 'Subscription');
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributor.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributor.alias]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === DISTRIBUTOR_CONSTANTS.FIELD.NAME) {
                form.form.controls[DISTRIBUTOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'Subscription List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

}
