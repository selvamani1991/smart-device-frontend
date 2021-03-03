import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CONSUMER_TICKET_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE } from '../../../../constants';
import { AlertService } from '../../../../shared/services/alert.service';
import { DateService } from '../../../../shared/services/date.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { ConsumerTicketService } from '../../services/consumer-ticket.service';
import { ERROR_CODE } from '../../../../constants';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
import { TooltipService } from '../../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'all-list.component.html'
})

export class AllListComponent implements OnInit {
    consumerTickets: any = [];
    product= '';
    consumerTicket: any= {};
    consumer: any= {};
    consumerTicketDetails: any= [];
    consumerProduct: any= {};
    consumerProductType: any= {};
    services= [];
    form: any= {};
    alias: any= {};
    entryDate: any;
    loading = false;
    active= false;
    CONSUMER_TICKET_CONSTANTS= CONSUMER_TICKET_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET,
        pageTitle: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST,
        pageDesc: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private consumerTicketService: ConsumerTicketService,
                private alertService: AlertService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CONSUMER_TICKET_CONSTANTS = CONSUMER_TICKET_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadConsumerTickets();
    }

    loadConsumerTickets() {
        this.loading = true;
        $('body').addClass('loading');
        this.consumerTicketService.getAllConsumerTickets(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.consumerTickets = data['data'];
                this.paginationItems = this.consumerTickets;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                let reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                this.tooltipService.enable();
                 for (let i = 0; i < this.consumerTickets.length; i++) {
                    if (this.consumerTickets[i].entryDate && this.consumerTickets[i].entryDate > 0 ) {
                        this.consumerTickets[i].entryDate = this.dateService.getDateTimeString(this.consumerTickets[i].entryDate);
                    }else {
                        this.consumerTickets[i].entryDate = 'N/A';
                    }
                }
            },
            failure => {
               $('body').removeClass('loading');
               this.httpResponseService.showErrorResponse(failure);
               this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
               this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadConsumerTickets();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadConsumerTickets();
    }

    reloadList() {
        this.loadConsumerTickets();
    }

    show(consumerTicket) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_SHOW, consumerTicket.alias]);
    }

    edit(consumerTicket) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_EDIT, consumerTicket.alias, '']);
    }

    markDeleted(consumerTicket) {
        this.sweetAlertService.deleteCheck(this, consumerTicket);
    }

    remove(consumerTicket) {
        this.consumerTicketService.deleteConsumerTicket(consumerTicket.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
                this.loadConsumerTickets();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    searchConsumerTicket(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadConsumerTickets();
        } else {
            this.query = '';
            this.loadConsumerTickets();
        }
    }

    changeStatus(consumerTicket, status) {
        consumerTicket.active = status;
        this.consumerTicketService.updateConsumerTicket(consumerTicket)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_TICKET_CONSTANTS.FIELD.NAME) {
                form.form.controls[CONSUMER_TICKET_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

}
