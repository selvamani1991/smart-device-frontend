import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    clients: any= [];
    client: any= {};
    alias: any= {};
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
        entity: CLIENT_CONSTANTS.LABEL.CLIENT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    page= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private clientService: ClientService,
                private alertService: AlertService,
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
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);
    }

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientService.getAllClients(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.clients = data['data'];
            this.paginationItems = this.clients;
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
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadClients();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadClients();
    }

    addClient() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CREATE]);
    }

    edit(client) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_EDIT, client.alias]);
    }

    show(client) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_SHOW, client.alias]);
    }

    markDeleted(client) {
        this.sweetAlertService.deleteCheck(this, client);
    }

    remove(client) {
        this.clientService.deleteClient(client.alias, this.client)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                client.isDeleted = true;
                client.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
                this.loadClients();
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
        this.loadClients();
    }

    changeStatus(client, status) {
        client.active = status;
        this.clientService.updateClient(client)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
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

    changePassword(client) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CHANGE_PASSWORD, client.alias]);
    }

    searchClient(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadClients();
        }else {
            this.query = '';
            this.loadClients();
        }
    }

    showClientSubscription(client) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, client.alias]);
    }


}
