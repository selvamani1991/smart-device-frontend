import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { PRODUCT_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { ProductSubscriptionService } from '../../services/product-subscription.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    productSubscription: any= {};
    productSubscriptions: any= [];
    productSubscriptionForm: FormGroup;
    selectedDuration= 0;
    durations = [];
    selectedElapsedPeriod= 0;
    elapsedPeriods = [];
    PRODUCT_SUBSCRIPTION_CONSTANTS= PRODUCT_SUBSCRIPTION_CONSTANTS;
    PRODUCT_SUBSCRIPTION_VALIDATOR= PRODUCT_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION,
        pageTitle: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_CREATE,
        pageDesc: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_CREATE_DESC
    };
    steps= [];
    buttonName= PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_ACTION_CREATE;
    backUrl= PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST;
    formValidation= {
    duplicateErrorProductSubscriptionname: false,
    duplicateErrorEmail: false
    };

    constructor(
                private router: Router,
                private productSubscriptionService: ProductSubscriptionService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_SUBSCRIPTION_CONSTANTS = PRODUCT_SUBSCRIPTION_CONSTANTS;
        this.PRODUCT_SUBSCRIPTION_VALIDATOR = PRODUCT_SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_CREATE_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION);
    }

    ngOnInit() {
        this.productSubscriptionForm = this.createProductSubscriptionForm();
          $('.select2').select2({
             width: '100%'
        });
        this.loadDurations();
             $('#duration').select2({
              width: '100%'
        });
        this.loadElapsedPeriods();
             $('#elaspsedPeriod').select2({
              width: '100%'
        });
    }

    createProductSubscriptionForm(): FormGroup {
        return this.productSubscriptionForm = this._formBuilder.group({
            id                    : [this.productSubscription.id],
            name                  : [this.productSubscription.name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            description           : [this.productSubscription.description, [Validators.required, Validators.minLength(3)]],
            price                 : [this.productSubscription.price, [Validators.required, Validators.pattern('^(?:0|[1-9][0-9]*)\.[0-9]+$')]],
            duration              : [this.productSubscription.duration, [Validators.required]],
            machineTypeCount      : [this.productSubscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            machineCount          : [this.productSubscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            maxUsages             : [this.productSubscription.maxUsages, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            elapsedPeriod         : [this.productSubscription.elapsedPeriod, [Validators.required]],
            salesPercentage       : [this.productSubscription.salesPercentage, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],

        });
    }

    createProductSubscription() {
        this.productSubscription = this.productSubscriptionForm.value;
        $('body').addClass('loading');
        this.productSubscription.duration = this.selectedDuration;
        this.productSubscription.elapsedPeriod = this.selectedElapsedPeriod;
        this.productSubscriptionService.saveProductSubscription(this.productSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']){
                this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    loadDurations() {
        var _self = this;
        for (let i = 1; i <= 60; i++) {
           this.durations.push({id: i , name: i + ' month'});
        }

        $('#duration').on('select2:select', function(e){
             var selectId = e.params.data.id;
            _self.selectedDuration = selectId;

            if (_self.selectedDuration > 0){
                _self.productSubscriptionForm.get('duration').setErrors(null);
            }else {
                _self.productSubscriptionForm.get('duration').setErrors({'required': true});
            }

        });

    }

    loadElapsedPeriods() {
       var _self = this;
        for (let i = 1; i <= 60; i++) {
            this.elapsedPeriods.push({id: i , name: i + ' day'});
        }
        $('#elapsedPeriod').on('select2:select', function(e){
            var selectId = e.params.data.id;
            _self.selectedElapsedPeriod = selectId;

            if (_self.selectedElapsedPeriod > 0) {
                _self.productSubscriptionForm.get('elapsedPeriod').setErrors(null);
            }else {
                _self.productSubscriptionForm.get('elapsedPeriod').setErrors({'required': true});
            }
        });
    }



    list() {
        this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == PRODUCT_SUBSCRIPTION_CONSTANTS.FIELD.NAME) {
                this.productSubscriptionForm.get('name').setErrors({'duplicate': true});
            }

        }
    }
}
