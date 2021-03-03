import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SUBSCRIPTION_CONSTANTS } from '../../constants';
import { SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { SubscriptionService } from '../../services/subscription.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { LegendSettings } from '@amcharts/amcharts4/charts';
declare var $: any;

import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    currentUser=undefined;
    subscription: any= {};
    productCategory: any= {};
    productCategories: any= [];
    subscriptions: any= [];
    currencies: any= [];
    durations: any= [];
    salesPercentages: any= [];
    elapsedPeriods: any= [];
    form: any= {};
    selectedCurrency= '';
    selectedProductCategory= {id:0,alias:''};
    showDropdown= true;
    selectedDuration= 0;
    selectedElapsedPeriod= 0;
    subscriptionForm: FormGroup;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    SUBSCRIPTION_VALIDATOR= SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION,
        pageTitle: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_CREATE,
        pageDesc: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_CREATE_DESC
    };
    steps= [];
        buttonName= SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_ACTION_CREATE;
        backUrl= SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST;
        formValidation= {
        duplicateErrorSubscriptionname: false,
        duplicateErrorEmail: false
    };
    constructor(
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
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_CREATE_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );



    }

    ngOnInit() {
        this.subscriptionForm = this.createSubscriptionForm();
        $('.select2').select2({
            width: '100%'
        });
        this.loadDurations();
            $('#duration').select2({
            width: '100%'
        });
        this.loadElapsedPeriods();
            $('#elapsedPeriod').select2({
            width: '100%'
        });

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
        if(this.currentUser.userType!='SuperAdmin'){
            return this.subscriptionForm = this._formBuilder.group({
                id                    : [this.subscription.id],
                ownerId               : [this.subscription.ownerId],
                name                  : [this.subscription.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.subscription.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                price                 : [this.subscription.price, [Validators.required, Validators.pattern(/^([1-9]\d*)(\.\d+)?$/)]],
                duration              : [this.subscription.duration, [Validators.required]],
                costPerMachine        : [this.subscription.costPerMachine, [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
                machineTypeCount      : [this.subscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                machineCount          : [this.subscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                maxUsages             : [this.subscription.maxUsages, [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
                elapsedPeriod         : ['', [Validators.required]],
                //salesPercentage       : [{value: this.subscription.salesPercentage, disabled: this.showDropdown},[Validators.required,Validators.pattern('^[0-9]{1,4}$')]],
                salesPercentage       : [{value: this.subscription.salesPercentage, disabled: this.showDropdown},[Validators.required,Validators.pattern('^\((?=.)([+-]?([0-9]*)(\.([0-9]+))?)\)$')]],
                salesApplicable       : [false],
                currency              : ['', [Validators.required]],
                productCategory       : ['', [Validators.required]]
            });
        }
        if(this.currentUser.userType=='SuperAdmin'){
            return this.subscriptionForm = this._formBuilder.group({
                id                    : [this.subscription.id],
                ownerId               : [this.subscription.ownerId],
                name                  : [this.subscription.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.subscription.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                price                 : [this.subscription.price, [Validators.required, Validators.pattern(/^([1-9]\d*)(\.\d+)?$/)]],
                duration              : [this.subscription.duration, [Validators.required]],
                costPerMachine        : [this.subscription.costPerMachine, [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
                machineTypeCount      : [this.subscription.machineTypeCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                machineCount          : [this.subscription.machineCount, [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
                maxUsages             : [this.subscription.maxUsages, [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
                elapsedPeriod         : ['', [Validators.required]],
                salesPercentage       : [{value: this.subscription.salesPercentage, disabled: this.showDropdown},[Validators.required,Validators.pattern('^\((?=.)([+-]?([0-9]*)(\.([0-9]+))?)\)$')]],
                salesApplicable       : [false],
                currency              : ['', [Validators.required]],
                productCategory       : ['', [Validators.required]]
            });
        }

    }

    createSubscription() {
        this.subscription = this.subscriptionForm.value;
        $('body').addClass('loading');
        this.subscription.duration = this.selectedDuration;
        this.subscription.elapsedPeriod = this.selectedElapsedPeriod;
        this.subscription.currency = this.selectedCurrency;
        this.subscription.productCategory = this.selectedProductCategory;
        if(this.currentUser.userType=='SuperAdmin'){
          this.subscription.salesPercentage=100;
        }
        this.subscriptionService.saveSubscription(this.subscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                    this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
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

    loadDurations() {
        var _self = this;
        for (let i = 1; i <= 60; i++) {
           this.durations.push({id: i , name: i + ' month'});
        }

        $('#duration').on('select2:select', function(e){
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
        for (let i = 1; i <= 30; i++) {
           this.elapsedPeriods.push({id: i , name: i + ' day'});
        }

        $('#elapsedPeriod').on('select2:select', function(e){
            var selectId = e.params.data.id;
            _self.selectedElapsedPeriod = selectId;

            if (_self.selectedElapsedPeriod > 0) {
                _self.subscriptionForm.get('elapsedPeriod').setErrors(null);
            }else {
                    _self.subscriptionForm.get('elapsedPeriod').setErrors({'required': true});
            }
        });
    }

    list() {
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
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

    selectSalesPercentage() {
        this.showDropdown = this.subscriptionForm.get('salesApplicable').value;
        if (this.showDropdown) {
            $('#showSales').hide();
            this.subscriptionForm.get('salesPercentage').disable();

        }else {
           $('#showSales').show();
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
