import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';

//import { CONSUMER_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';

import { ConsumerService } from '../../services/consumer.service';
import { AdminService } from '../../../shared/services/admin.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'subscription-create.component.html'
})

export class SubscriptionCreateComponent implements OnInit {
    loading = false;
    submitted = false;
    consumerSubscription: any= {};
    consumerSubscriptions: any= [];
    durations: any= [];
    selectedDuration= 0;
    consumerSubscriptionForm: FormGroup;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    //CONSUMER_SUBSCRIPTION_VALIDATOR= CONSUMER_SUBSCRIPTION_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION,
        pageTitle: CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_CREATE,
        pageDesc: CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_CREATE_DESC
    };
    steps= [];
    //buttonName= CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_ACTION_CREATE;
    backUrl= CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_SUBSCRIPTION_LIST;
    formValidation= {
    duplicateErrorConsumerSubscriptionname: false,
    duplicateErrorEmail: false
    };

    constructor(
                private router: Router,
                private consumerService: ConsumerService,
                private adminService: AdminService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        //this.CONSUMER_SUBSCRIPTION_VALIDATOR = CONSUMER_SUBSCRIPTION_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_CREATE_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION);
    }

    ngOnInit() {
        this.consumerSubscriptionForm = this.createConsumerSubscriptionForm();
        this.loadDurations();
            $('#durationSelect2').select2({
            width: '100%'
        });
    }

    createConsumerSubscriptionForm(): FormGroup {
        return this.consumerSubscriptionForm = this._formBuilder.group({
            id                    : [this.consumerSubscription.id],
            name                  : [this.consumerSubscription.name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            description           : [this.consumerSubscription.description, [Validators.required, Validators.minLength(3)]],
            price                 : [this.consumerSubscription.price, [Validators.required, Validators.minLength(2),Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
            duration              : [this.consumerSubscription.duration, [Validators.required]],
            //subscriberCount       : [this.consumerSubscription.subscriberCount, [Validators.required, Validators.minLength(2)]],
            //deviceCount           : [this.consumerSubscription.deviceCount, [Validators.required, Validators.minLength(2)]],
            //sharedUserCount       : [this.consumerSubscription.sharedUserCount, [Validators.required, Validators.minLength(2)]],

        });
    }

    createConsumerSubscription() {
        this.consumerSubscription = this.consumerSubscriptionForm.value;
        $('body').addClass('loading');
        this.consumerSubscription.duration = this.selectedDuration;
        this.consumerService.saveConsumerSubscription(this.consumerSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    loadDurations() {
       var _self = this;
        for (let i = 1; i <= 60; i++) {
           this.durations.push({id: i , name: i + ' month'});
        }
        $('#durationSelect2').on('select2:select', function(e){
           var selectId = e.params.data.id;
           _self.selectedDuration = selectId;

           if (_self.selectedDuration > 0) {
                _self.consumerSubscriptionForm.get('duration').setErrors(null);
           }else {
                _self.consumerSubscriptionForm.get('duration').setErrors({'required': true});
            }
        });
    }

    validateForm() {
    }

   /*  list() {
        this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
    } */
}
