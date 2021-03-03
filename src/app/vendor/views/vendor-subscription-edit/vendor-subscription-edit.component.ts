import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { VENDOR_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { VendorService } from '../../services/vendor.service';
import { AdminService } from '../../../shared/services/admin.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'vendor-subscription-edit.component.html'
})

export class VendorSubscriptionEditComponent implements OnInit {
    loading = false;
    vendorSubscription: any= {};
    subscription: any= {};
    client: any= {};
    currentUser=undefined;
    subscriptions: any= [];
    selectedSubscription= {id: 0};
    startDate: any= {};
    endDate: any= {};
    vendorSubscriptionForm: FormGroup;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    VENDOR_VALIDATOR= VENDOR_VALIDATOR;
    VENDOR_SUBSCRIPTION_VALIDATOR= VENDOR_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION_EDIT,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_EDIT;
    backUrl= VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorVendorname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private vendorService: VendorService,
                private adminService: AdminService,
                private authenticationService: AuthenticationService,
                private subscriptionService: SubscriptionService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.VENDOR_VALIDATOR = VENDOR_VALIDATOR;
        this.VENDOR_SUBSCRIPTION_VALIDATOR = VENDOR_SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadVendorSubscription(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadSubscription();
        this.loadClient();
        this.vendorSubscriptionForm = this.createVendorSubscriptionForm();
        $('#subscriptionVendorSelect').select2({
            width: '100%'
        });

        $('#vendorSubscriptionStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 this.vendorSubscriptionForm.get('startDate').setErrors(null);
            }
        });

        $('#vendorSubscriptionEndDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
            }
        });
    }

    createVendorSubscriptionForm(): FormGroup {
        this.vendorSubscription.startDate = this.dateService.getDateString(this.vendorSubscription.startDate);
        this.vendorSubscription.endDate = this.dateService.getDateString(this.vendorSubscription.endDate);
        this.selectedSubscription = this.vendorSubscription.subscription ? this.vendorSubscription.subscription : {};
        return this.vendorSubscriptionForm = this._formBuilder.group({
             id                    : [this.vendorSubscription.id],
             alias                 : [this.vendorSubscription.alias],
             ownerId               : [this.vendorSubscription.ownerId],
             subscription          : [this.vendorSubscription.subscription ? this.selectedSubscription.id : 0, [Validators.required]],
             startDate             : [this.vendorSubscription.startDate, [Validators.required]],
             endDate               : [this.vendorSubscription.endDate, [Validators.required]],
             active                : [this.vendorSubscription.active],
             vendor                : [this.vendorSubscription.vendor]

        });
    }

    loadSubscription() {
        var _self = this;
        this.vendorService.getSubscription()
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
            this.vendorSubscriptionForm = this.createVendorSubscriptionForm();
            setTimeout(function(){
                $('#subscriptionVendorSelect').select2({
                    width: '100%'
                });
                $('#subscriptionVendorSelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);
                    if (selectId > 0) {
                        _self.vendorSubscriptionForm.get('subscription').setErrors(null);
                    }else {
                         _self.vendorSubscriptionForm.get('subscription').setErrors({'required': true});
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
                this.vendorSubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    updateVendorSubscription() {
        this.vendorSubscription = this.vendorSubscriptionForm.value;
        $('body').addClass('loading');
        this.vendorSubscription.subscription = this.selectedSubscription;
        this.vendorSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.vendorSubscription.endDate = this.dateService.getLongFromString(this.endDate);
        this.vendorService.updateVendorSubscription(this.vendorSubscription)
        .subscribe(
        data => {
        $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);

            } else {
                this.sweetAlertService.updateConfirmation(this.client.vendorNickName + ' ' + 'Subscription');
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendorSubscription.vendor.alias]);

            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendorSubscription.vendor.alias]);
            this.loading = false;
        });
    }

    loadVendorSubscription(alias) {
        this.vendorService.getVendorSubscriptions(alias)
        .subscribe(
        data => {
            this.vendorSubscription = data['data'][0];
            this.vendorSubscriptionForm = this.createVendorSubscriptionForm();
            this.startDate = this.vendorSubscription.startDate;
            this.endDate = this.vendorSubscription.endDate;
            this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'Subscription List', VENDOR_CONSTANTS.URL.VENDOR_SUBSCRIPTION_LIST_ALIAS.replace(":alias",this.vendorSubscription.vendor.alias),true);
            this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'Subscription Edit', VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });

    }

    list() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendorSubscription.vendor.alias]);
    }

    validateForm() {
         let valid = true;
         return valid;
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.loadVendorSubscription(this.alias);
        },
        () => {
           this.loading = false;
        });
    }
}

