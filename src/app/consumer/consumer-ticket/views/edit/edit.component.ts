import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_TICKET_CONSTANTS } from '../../constants';
import { CONSUMER_PRODUCT_CONSTANTS } from '../../../consumer-product/constants';
import { CONSUMER_TICKET_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import { ConsumerTicketService } from '../../services/consumer-ticket.service';
import { DateService } from '../../../../shared/services/date.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    consumerTicket: any= {};
    consumerTickets: any= [];
    consumerProduct: any= {};
    consumerProductType: any= {};
    entryDate: any;
    product= '';
    status: any= {};
    statuses: any= [];
    selectedStatus= {id: '', name: ''};
    consumerTicketForm: FormGroup;
    CONSUMER_TICKET_CONSTANTS= CONSUMER_TICKET_CONSTANTS;
    CONSUMER_PRODUCT_CONSTANTS= CONSUMER_PRODUCT_CONSTANTS;
    CONSUMER_TICKET_VALIDATOR= CONSUMER_TICKET_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET,
        pageTitle: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_EDIT,
        pageDesc: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_EDIT_DESC
    };
    steps= [];
    buttonName= CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_ACTION_EDIT;
    backUrl= CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorConsumerTicketname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private consumerTicketService: ConsumerTicketService,
                private dateService: DateService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_TICKET_CONSTANTS = CONSUMER_TICKET_CONSTANTS;
        this.CONSUMER_PRODUCT_CONSTANTS = CONSUMER_PRODUCT_CONSTANTS;
        this.CONSUMER_TICKET_VALIDATOR = CONSUMER_TICKET_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.product = params.product;
            this.loadConsumerTicket(this.alias);
        });
        this.statuses = [
            {'id': 'Open', 'name': 'Open'},
            {'id': 'Closed', 'name': 'Closed'}
        ];
    }

    ngOnInit() {
        this.consumerTicketForm = this.createConsumerTicketForm();
    }

    createConsumerTicketForm(): FormGroup {
        this.selectedStatus = this.consumerTicket.status ? this.consumerTicket.status : '';
        return this.consumerTicketForm = this._formBuilder.group({
            id                    : [this.consumerTicket.id],
            alias                 : [this.consumerTicket.alias],
            ownerId               : [this.consumerTicket.ownerId],
            createdBy             : [this.consumerTicket.createdBy],
            consumerProduct       : [this.consumerTicket.consumerProduct],
            issueType             : [this.consumerTicket.issueType],
            description           : [this.consumerTicket.description],
            subject               : [this.consumerTicket.subject, [Validators.required]],
            entryDate             : [this.consumerTicket.entryDate, []],
            ticketId              : [this.consumerTicket.ticketId],
            solution              : [this.consumerTicket.solution, [Validators.required, Validators.minLength(3)]],
            status                : [this.selectedStatus ? this.consumerTicket.status : 'Open', []]

        });
    }

    loadConsumerTicket(alias) {
        let _self = this;
        this.consumerTicketService.getConsumerTicket(alias)
        .subscribe(
        data => {
            this.consumerTicket = data['data'][0];
            this.consumerTicketForm = this.createConsumerTicketForm();
            this.consumerTicket.entryDate = this.dateService.getDateTimeString(this.consumerTicket.entryDate);
            if(this.consumerTicket == 0){
                this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_TICKET_LIST_ALIAS.replace(":alias",this.consumerTicket.consumerProduct.alias),true);
                this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_EDIT_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_EDIT, false);
                this.steps = this.breadCrumService.getSteps();

            }else{
                this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST,true);
                this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_EDIT_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_EDIT, false);
                this.steps = this.breadCrumService.getSteps();
            }

             $('#statusSelect').select2({
                width: '100%'
             });
             setTimeout(function(){
                 $('#statusSelect').select2({
                     width: '100%'
                 });
                 $('#statusSelect').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectedStatus = selectId;
                });
             }, 1000);

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    updateConsumerTicket(form) {
        this.consumerTicket = this.consumerTicketForm.value;
        $('body').addClass('loading');
        this.consumerTicket.status = this.selectedStatus;
        this.consumerTicketService.updateConsumerTicket(this.consumerTicket)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                if (this.product.length > 0) {
                    this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, this.product]);
                }else {
                    this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
                }
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_TICKET_CONSTANTS.FIELD.NAME) {
                this.consumerTicketForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        if (this.product.length > 0) {
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, this.product]);
        }else {
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
        }
    }

}
