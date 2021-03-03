import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'client-subscription-list.component.html'
})

export class ClientSubscriptionListComponent implements OnInit {
    clientSubscriptions: any= [];
    clientSubscription: any= {};
    alias: any= {};
    client: any= {};
    form: any= {};
    services= [];
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_LIST_DESC
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
                private clientService: ClientService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_LIST, true);
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_LIST, CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadClient();
        });
    }

    ngOnInit() {
        this.loadClientSubscriptions();
    }

    loadClientSubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientService.getClientSubscription(this.currentPage, this.pageSize, this.alias,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.clientSubscriptions = data['data'];
            this.paginationItems = this.clientSubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

            for (var i = 0; i < this.clientSubscriptions.length; i++){
                this.clientSubscriptions[i].startDate = this.dateService.getDateString(this.clientSubscriptions[i].startDate);
                this.clientSubscriptions[i].endDate = this.dateService.getDateString(this.clientSubscriptions[i].endDate);
            }

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadClient() {
        this.clientService.getClient(this.alias)
        .subscribe(
        data => {
            this.client = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadClientSubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadClientSubscriptions();
    }

    searchClientSubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadClientSubscriptions();
        }else {
            this.query = '';
            this.loadClientSubscriptions();
        }
    }

    addClientSubscription() {
        $('#clientSubscriptionModal').modal('show');
    }

    reloadClientSubscription() {
        this.currentPage = 1;
        this.pageSize = APP_CONFIG.PAGE_SIZE;
        this.loadClientSubscriptions();
    }

    edit(clientSubscription) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_EDIT, clientSubscription.alias]);
    }

    changeStatus(clientSubscription, status) {
        clientSubscription.active = status;
        clientSubscription.startDate = this.dateService.getLongFromString(clientSubscription.startDate);
        clientSubscription.endDate = this.dateService.getLongFromString(clientSubscription.endDate);
        this.clientService.updateClientSubscription(clientSubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                clientSubscription.startDate = this.dateService.getDateString(clientSubscription.startDate);
                clientSubscription.endDate = this.dateService.getDateString(clientSubscription.endDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.client.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.client.alias]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CLIENT_CONSTANTS.FIELD.NAME) {
                form.form.controls[CLIENT_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }
}
