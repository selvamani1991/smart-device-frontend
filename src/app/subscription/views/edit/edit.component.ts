import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SUBSCRIPTION_CONSTANTS } from '../../constants';
import { SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SubscriptionService } from '../../services/subscription.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var  $: any;
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    subscription: any= {};
    currency: any= {};
    subscriptions= [];
    currencies= [];
    currentUser=undefined;
    durations= [];
    elapsedPeriods= [];
    salesPercentages= [];
    duration: any= {};
    showDropdown= true;
    elapsedPeriod: any= {};
    salesPercentage: any= {};
    selectedProductCategory= {id: 0, alias: ''};
    productCategory: any= {};
    productCategories: any= [];
    selectedDuration= 0;
    selectedElapsedPeriod= 0;
    selectedSalesPercentage= 0;
    selectedCurrency= {id: ''};
    subscriptionForm: FormGroup;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    SUBSCRIPTION_VALIDATOR= SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION,
        pageTitle: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_EDIT,
        pageDesc: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_ACTION_EDIT;
    backUrl= SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorSubscriptionname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private subscriptionService: SubscriptionService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        this.SUBSCRIPTION_VALIDATOR = SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_EDIT_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadSubscription(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        $('.select2').select2({
            width: '100%'
        });
        this.subscriptionForm = this.createSubscriptionForm();

        this.loadCurrency();
        $('#currencySelect').select2({
            width: '100%'
        });
        this.loadProductCategories();
        $('#productCategorySelect2').select2({
            width: '100%'
        });

    }

    createSubscriptionForm(): FormGroup {
        this.selectedDuration = this.subscription.duration ? this.subscription.duration : 0;
        this.selectedProductCategory = this.subscription.productCategory ? this.subscription.productCategory : {};
        this.selectedCurrency = this.subscription.currency ? this.subscription.currency : {};
        this.selectedElapsedPeriod = this.subscription.elapsedPeriod ? this.subscription.elapsedPeriod : 0;
        if(this.currentUser.userType!='SuperAdmin'){
            return this.subscriptionForm = this._formBuilder.group({
                id                    : [this.subscription.id],
                alias                 : [this.subscription.alias],
                ownerId               : [this.subscription.ownerId],
                logo                  : [this.subscription.logo],
                name                  : [this.subscription.name, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.subscription.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                price                 : [this.subscription.price, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                duration              : [this.selectedDuration, [Validators.required]],
                costPerMachine        : [this.subscription.costPerMachine, [Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                machineTypeCount      : [this.subscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                machineCount          : [this.subscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                maxUsages             : [this.subscription.maxUsages, [Validators.required,Validators.pattern('^[0-9]{1,4}$')]],
                elapsedPeriod         : [this.subscription.elapsedPeriod ? this.subscription.elapsedPeriod : '', [Validators.required]],
                salesPercentage       : [this.subscription.salesPercentage,[Validators.required,Validators.pattern('^\((?=.)([+-]?([0-9]*)(\.([0-9]+))?)\)$')]],
                subscriberCount       : [this.subscription.subscriberCount],
                currency              : [this.subscription.currency ? this.selectedCurrency.id : '', [Validators.required]],
                salesApplicable       : [this.subscription.salesApplicable ? this.subscription.salesApplicable : ''],
                productCategory       : [this.subscription.productCategory ? this.selectedProductCategory.id : 0, [Validators.required]],

            });
        }
        if(this.currentUser.userType=='SuperAdmin'){
            return this.subscriptionForm = this._formBuilder.group({
                id                    : [this.subscription.id],
                alias                 : [this.subscription.alias],
                ownerId               : [this.subscription.ownerId],
                logo                  : [this.subscription.logo],
                name                  : [this.subscription.name, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.subscription.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                price                 : [this.subscription.price, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                duration              : [this.selectedDuration, [Validators.required]],
                costPerMachine        : [this.subscription.costPerMachine, [Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                machineTypeCount      : [this.subscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                machineCount          : [this.subscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                maxUsages             : [this.subscription.maxUsages, [Validators.required,Validators.pattern('^[0-9]{1,4}$')]],
                elapsedPeriod         : [this.subscription.elapsedPeriod ? this.subscription.elapsedPeriod : '', [Validators.required]],
                salesPercentage       : [this.subscription.salesPercentage,[Validators.required,Validators.pattern('^\((?=.)([+-]?([0-9]*)(\.([0-9]+))?)\)$')]],
                subscriberCount       : [this.subscription.subscriberCount],
                currency              : [this.subscription.currency ? this.selectedCurrency.id : '', [Validators.required]],
                salesApplicable       : [this.subscription.salesApplicable ? this.subscription.salesApplicable : ''],
                productCategory       : [this.subscription.productCategory ? this.selectedProductCategory.id : 0, [Validators.required]],

            });
        }
    }

    updateSubscription() {
        this.subscription = this.subscriptionForm.value;
        $('body').addClass('loading');
        this.subscription.duration = this.selectedDuration;
        this.subscription.elapsedPeriod = this.selectedElapsedPeriod;
        this.subscription.currency = this.selectedCurrency;
        this.subscription.productCategory = this.selectedProductCategory;
        this.subscriptionService.updateSubscription(this.subscription)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            this.loading = false;
        });

    }

    loadSubscription(alias) {
        this.subscriptionService.getSubscription(alias)
        .subscribe(
        data => {
            this.subscription = data['data'][0];
            this.subscriptionForm = this.createSubscriptionForm();
            this.loadProductCategories();
            this.loadDurations();
            this.showDropdown = this.subscription.salesApplicable;
            $('#durationSelect2').select2({
                width: '100%'
            });
            this.loadElapsedPeriods();
            $('#salesPercentageSelect2').select2({
                width: '100%'
            });

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
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
                _self.subscriptionForm.get('duration').setErrors(null);
            }else {
                _self.subscriptionForm.get('duration').setErrors({'required': true});
            }
        });
    }

    loadElapsedPeriods() {
        var _self = this;
        this.elapsedPeriod = [];
        for (let i = 1; i <= 30; i++) {
            this.elapsedPeriods.push({id: i , name: i + ' day'});
        }
        $('#elapsedPeriodSelect2').on('select2:select', function(e){
            var selectId = e.params.data.id;
            _self.selectedElapsedPeriod = selectId;

            if (_self.selectedElapsedPeriod > 0) {
                _self.subscriptionForm.get('elapsedPeriod').setErrors(null);
            }else {
                _self.subscriptionForm.get('elapsedPeriod').setErrors({'required': true});
            }
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == SUBSCRIPTION_CONSTANTS.FIELD.NAME) {
                this.subscriptionForm.get('name').setErrors({'duplicate': true});
            }
            if (data.error.errorField == SUBSCRIPTION_CONSTANTS.FIELD.NAME_FIELD) {
                this.subscriptionForm.get('name').setErrors({'duplicate': true});
            }

        }
    }

    list() {
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
    }

    selectSalesPercentage() {
        if (this.subscriptionForm.get('salesApplicable').value == true){
            this.showDropdown = false;
            this.subscriptionForm.get('salesPercentage').disable();
        }else{
            this.showDropdown = true;
            this.subscriptionForm.get('salesPercentage').enable();
        }

    }

    loadCurrency() {
        var _self = this;
        this.subscriptionService.getCurrency()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.currencies = data['data'];
                $('#currencySelect').select2({
                    width: '100%'
                });
                $('#currencySelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectCurrency(selectId);
                    if (selectId > 0) {
                        _self.subscriptionForm.get('currency').setErrors(null);
                   }else {
                        _self.subscriptionForm.get('currency').setErrors({'required': true});
                    }
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectCurrency(currencyId) {
        for (let i = 0; i < this.currencies.length; i++) {
            if (this.currencies[i].id == currencyId) {
                this.selectedCurrency = this.currencies[i];
                 this.subscriptionForm.get('currency').setErrors(null);
            }
        }
    }

    loadProductCategories() {
        var _self = this;
        this.subscriptionService.getProductCategory()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productCategories = data['data'];
                var activeProductCategories=[];
                for(let i=0; i<this.productCategories.length; i++){
                     if(this.productCategories[i].active){
                         activeProductCategories.push(this.productCategories[i])
                     }
                }
                this.productCategories=activeProductCategories;
                $('#productCategorySelect2').select2({
                width: '100%'
            });
            $('#productCategorySelect2').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectProductCategory(selectId);
                if (selectId > 0) {
                    _self.subscriptionForm.get('productCategory').setErrors(null);
                }else {
                    _self.subscriptionForm.get('productCategory').setErrors({'required': true});
                }
            });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectProductCategory(productCategoryId) {
        for (let i = 0; i < this.productCategories.length; i++) {
            if (this.productCategories[i].id == productCategoryId) {
                this.selectedProductCategory = this.productCategories[i];
                this.subscriptionForm.get('productCategory').setErrors(null);
            }
        }
    }
}
