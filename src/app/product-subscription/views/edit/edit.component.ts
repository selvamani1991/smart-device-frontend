import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { PRODUCT_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ProductSubscriptionService } from '../../services/product-subscription.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    productSubscription: any= {};
    productSubscriptions: any= [];
    productSubscriptionForm: FormGroup;
    selectedDuration= 0;
    selectedElapsedPeriod= 0;
    duration: any= {};
    durations = [];
    elapsedPeriod: any= {};
    elapsedPeriods = [];
    PRODUCT_SUBSCRIPTION_CONSTANTS= PRODUCT_SUBSCRIPTION_CONSTANTS;
    PRODUCT_SUBSCRIPTION_VALIDATOR= PRODUCT_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION,
        pageTitle: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_EDIT,
        pageDesc: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_ACTION_EDIT;
    backUrl= PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorProductSubscriptionname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productSubscriptionService: ProductSubscriptionService,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_SUBSCRIPTION_CONSTANTS = PRODUCT_SUBSCRIPTION_CONSTANTS;
        this.PRODUCT_SUBSCRIPTION_VALIDATOR = PRODUCT_SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_EDIT_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductSubscription(this.alias);
        });
    }

    ngOnInit() {
        $('.select2').select2({
            width: '100%'
        });
        this.productSubscriptionForm = this.createProductSubscriptionForm();

    }

    createProductSubscriptionForm(): FormGroup {
        this.selectedDuration = this.productSubscription.duration ? this.productSubscription.duration : 0;
        this.selectedElapsedPeriod = this.productSubscription.elapsedPeriod ? this.productSubscription.elapsedPeriod : 0;
        return this.productSubscriptionForm = this._formBuilder.group({
            id                    : [this.productSubscription.id],
            ownerId               : [this.productSubscription.ownerId],
            alias                 : [this.productSubscription.alias],
            name                  : [this.productSubscription.name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            description           : [this.productSubscription.description, [Validators.required, Validators.minLength(3)]],
            price                 : [this.productSubscription.price, [Validators.required, Validators.pattern('^(?:0|[1-9][0-9]*)\.[0-9]+$')]],
            duration              : [this.selectedDuration, [Validators.required]],
            machineTypeCount      : [this.productSubscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            machineCount          : [this.productSubscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            maxUsages             : [this.productSubscription.maxUsages, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
            elapsedPeriod         : [this.selectedElapsedPeriod, [Validators.required]],
            salesPercentage       : [this.productSubscription.salesPercentage, [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],

        });
    }

    loadProductSubscription(alias) {
        this.productSubscriptionService.getProductSubscription(alias)
        .subscribe(
        data => {
            this.productSubscription = data['data'][0];
            this.productSubscriptionForm = this.createProductSubscriptionForm();
            this.loadDurations();
            $('#durationSelect2').select2({
                width: '100%'
            });
            this.loadElapsedPeriods();
            $('#elapsedPeriodSelect2').select2({
                width: '100%'
            });
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    updateProductSubscription() {
        this.productSubscription = this.productSubscriptionForm.value;
        $('body').addClass('loading');
        this.productSubscription.duration = this.selectedDuration;
        this.productSubscription.elapsedPeriod = this.selectedElapsedPeriod;
        this.productSubscriptionService.updateProductSubscription(this.productSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    loadDurations() {
        var _self = this;
        this.duration = [];
        for (let i = 1; i <= 60; i++) {
            this.durations.push({id: i , name: i + ' month'});
        }
        $('#durationSelect2').on('select2:select', function(e){
            var selectId = e.params.data.id;
            _self.selectedDuration = selectId;

            if (_self.selectedDuration > 0) {
                _self.productSubscriptionForm.get('duration').setErrors(null);
            }else {
                _self.productSubscriptionForm.get('duration').setErrors({'required': true});
            }
        });

    }

    loadElapsedPeriods() {
        var _self = this;
        this.elapsedPeriod = [];
        for (let i = 1; i <= 60; i++) {
            this.elapsedPeriods.push({id: i , name: i + ' day'});
        }
        $('#elapsedPeriodSelect2').on('select2:select', function(e){
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
