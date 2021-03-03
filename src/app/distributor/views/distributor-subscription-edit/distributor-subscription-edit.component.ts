import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { DISTRIBUTOR_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { DistributorService } from '../../services/distributor.service';
import { AdminService } from '../../../shared/services/admin.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'distributor-subscription-edit.component.html'
})

export class DistributorSubscriptionEditComponent implements OnInit {
    loading = false;
    distributorSubscription: any= {};
    subscription: any= {};
    subscriptions: any= [];
    selectedSubscription= {id: 0};
    startDate: any= {};
    endDate: any= {};
    distributorSubscriptionForm: FormGroup;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    DISTRIBUTOR_SUBSCRIPTION_VALIDATOR= DISTRIBUTOR_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_EDIT,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_EDIT;
    backUrl= DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrordistributorname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private distributorService: DistributorService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.DISTRIBUTOR_SUBSCRIPTION_VALIDATOR = DISTRIBUTOR_SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadDistributorSubscription(this.alias);
        });
    }

    ngOnInit() {
        this.loadSubscription();
        this.distributorSubscriptionForm = this.createDistributorSubscriptionForm();
        $('#subscriptionDistributorSelect').select2({
            width: '100%'
        });

        $('#distributorSubscriptionStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 this.distributorSubscriptionForm.get('startDate').setErrors(null);
            }
        });

        $('#distributorSubscriptionEndDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
                this.distributorSubscriptionForm.get('endDate').setErrors(null);
            }
        });
    }

    createDistributorSubscriptionForm(): FormGroup {
        this.distributorSubscription.startDate = this.dateService.getDateString(this.distributorSubscription.startDate);
        this.distributorSubscription.endDate = this.dateService.getDateString(this.distributorSubscription.endDate);
        this.selectedSubscription = this.distributorSubscription.subscription ? this.distributorSubscription.subscription : {};
        return this.distributorSubscriptionForm = this._formBuilder.group({
            id                    : [this.distributorSubscription.id],
            alias                 : [this.distributorSubscription.alias],
            subscription          : [this.distributorSubscription.subscription ? this.selectedSubscription.id : 0, [Validators.required]],
            startDate             : [this.distributorSubscription.startDate, [Validators.required]],
            endDate               : [this.distributorSubscription.endDate, [Validators.required]],
            active                : [this.distributorSubscription.active],
            distributor                : [this.distributorSubscription.distributor]

        });
    }

    loadSubscription() {
        var _self = this;
        this.distributorService.getSubscription()
        .subscribe(
        data => {
            this.subscriptions = data['data'];
            var activeSubscriptions=[];
            for(let i=0; i<this.subscriptions.length; i++){
                if(this.subscriptions[i].active && !this.subscriptions[i].deleted){
                    activeSubscriptions.push(this.subscriptions[i])
                }
            }
            this.subscriptions=activeSubscriptions;
            this.distributorSubscriptionForm = this.createDistributorSubscriptionForm();
            setTimeout(function(){
                $('#subscriptionDistributorSelect').select2({
                    width: '100%'
                });
                $('#subscriptionDistributorSelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);
                     if (selectId > 0) {
                        _self.distributorSubscriptionForm.get('subscription').setErrors(null);
                     }else {
                         _self.distributorSubscriptionForm.get('subscription').setErrors({'required': true});
                     }
                });
            },500);
        },
        () => {
            this.loading = false;
        } );

    }

    selectSubscription(subscriptionId) {
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].id == subscriptionId) {
                this.selectedSubscription = this.subscriptions[i];
                this.distributorSubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    updateDistributorSubscription() {
        this.distributorSubscription = this.distributorSubscriptionForm.value;
        $('body').addClass('loading');
        this.distributorSubscription.subscription = this.selectedSubscription;
        this.distributorSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.distributorSubscription.endDate = this.dateService.getLongFromString(this.endDate);
        this.distributorService.updateDistributorSubscription(this.distributorSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);

            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributorSubscription.distributor.alias]);

            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributorSubscription.distributor.alias]);
            this.loading = false;
        });
    }

    loadDistributorSubscription(alias) {
        this.distributorService.getDistributorSubscriptions(alias)
        .subscribe(
        data => {
            this.distributorSubscription = data['data'][0];
            this.distributorSubscriptionForm = this.createDistributorSubscriptionForm();
            this.startDate = this.distributorSubscription.startDate;
            this.endDate = this.distributorSubscription.endDate;
            this.breadCrumService.pushStep(DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_LIST, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_SUBSCRIPTION_LIST_ALIAS.replace(":alias",this.distributorSubscription.distributor.alias),true);
            this.breadCrumService.pushStep(DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION_EDIT, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });

    }

    list() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributorSubscription.distributor.alias]);
    }

    validateForm() {
         let valid = true;
         return valid;
    }
}
