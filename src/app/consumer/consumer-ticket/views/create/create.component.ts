import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {CONSUMER_TICKET_CONSTANTS } from '../../constants';
import { CONSUMER_PRODUCT_CONSTANTS } from '../../../consumer-product/constants';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import { ConsumerProductService } from '../../../consumer-product/services/consumer-product.service';


import {CONSUMER_TICKET_VALIDATOR } from '../../validator';

import { ConsumerTicketService } from '../../services/consumer-ticket.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    consumerTicket: any= {};
    consumerTickets: any= [];
    issueTypes: any= [];
    consumerProduct: any= {};
    selectedIssueType= 0;
    alias: any= {};
    consumerTicketForm: FormGroup;
    CONSUMER_TICKET_CONSTANTS= CONSUMER_TICKET_CONSTANTS;
    CONSUMER_PRODUCT_CONSTANTS= CONSUMER_PRODUCT_CONSTANTS;
    CONSUMER_TICKET_VALIDATOR= CONSUMER_TICKET_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET,
        pageTitle: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_CREATE,
        pageDesc: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_CREATE_DESC
    };
    steps= [];
    buttonName= CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_ACTION_CREATE;
    backUrl= CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST;
    formValidation= {
    duplicateErrorConsumerTicketname: false,
    duplicateErrorEmail: false
    };

    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private consumerTicketService: ConsumerTicketService,
                private consumerProductService: ConsumerProductService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_TICKET_CONSTANTS = CONSUMER_TICKET_CONSTANTS;
        this.CONSUMER_PRODUCT_CONSTANTS = CONSUMER_PRODUCT_CONSTANTS;
        this.CONSUMER_TICKET_VALIDATOR = CONSUMER_TICKET_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.issueTypes = [
            {'id': 'warranty', 'name': 'Warranty'},
            {'id': 'servicing', 'name': 'Servicing'}
        ];
    }

    ngOnInit() {
        let _self = this;
        this.loadConsumerProduct();

        this.consumerTicketForm = this.createConsumerTicketForm();

         $('.select2').select2({
            width: '100%'
         });

        setTimeout(function(){
            $('.select2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedIssueType = selectId;

            });
        }, 1000);
    }

    createConsumerTicketForm(): FormGroup {
        return this.consumerTicketForm = this._formBuilder.group({
            id                    : [this.consumerTicket.id],
            subject               : [this.consumerTicket.subject, [Validators.required, Validators.minLength(2)]],
            description           : [this.consumerTicket.description, [Validators.required, Validators.minLength(3)]],
            issueType             : [this.consumerTicket.issueType ? this.consumerTicket.issueType : null]

        });
    }

    createConsumerTicket() {
        this.consumerTicket = this.consumerTicketForm.value;
        $('body').addClass('loading');
        this.consumerTicket.consumerProduct = this.consumerProduct;
        this.consumerTicket.issueType = this.selectedIssueType;
        this.consumerTicketService.saveConsumerTicket(this.consumerTicket)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, this.consumerProduct.alias]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
             this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, this.consumerProduct.alias]);
            this.loading = false;
        });
    }

    loadConsumerProduct() {
        this.consumerProductService.getConsumerProduct(this.alias)
        .subscribe(
        data => {
            this.consumerProduct = data['data'][0];
            this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_TICKET_LIST_ALIAS.replace(":alias",this.consumerProduct.alias),true);
            this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_EDIT_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST]);
            this.loading = false;
        });

    }

    validateForm() {

    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_TICKET_CONSTANTS.FIELD.NAME) {
                this.consumerTicketForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, this.consumerProduct.alias]);
    }
}
