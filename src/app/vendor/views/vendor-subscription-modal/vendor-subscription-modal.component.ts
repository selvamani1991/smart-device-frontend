import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {VENDOR_CONSTANTS } from '../../constants';
import {VENDOR_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorService } from '../../services/vendor.service';
import { DateService } from '../../../shared/services/date.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { AdminService } from '../../../shared/services/admin.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'vendor-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'vendor-subscription-modal.component.html'
})
export class VendorSubscriptionModalComponent implements OnInit {
    subscription: any= {};
    vendorSubscriptionForm: FormGroup;
    @Input() vendorSubscription;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    subscriptions: any= [];
    vendorSubscriptions: any= [];
    selectedSubscription= {id: 0};
    loading = false;
    click = false;
    startDate: any= {};
    vendor: any= {};
    alias: any= {};
    currentUser=undefined;

    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    VENDOR_SUBSCRIPTION_VALIDATOR= VENDOR_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_CREATE;
    buttonName1= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_EDIT;
    backUrl= VENDOR_CONSTANTS.URL.VENDOR_LIST;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private dateService: DateService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private vendorService: VendorService,
                private httpResponseService: HttpResponseService,
                 private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadVendor(this.alias);
        });

    }

    ngOnInit() {
        var self = this;
        this.vendorSubscriptionForm = this.createVendorSubscriptionForm();
        $('#vendorSubscriptionModal').on('hidden.bs.modal', function(){
            self.vendorSubscriptionForm = self.createVendorSubscriptionForm();
            self.loadSubscription();
        });
        this.loadSubscription();
        $('#subscriptionSelectVendor').select2({
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
    }

    createVendorSubscriptionForm(): FormGroup {
        return this.vendorSubscriptionForm = this._formBuilder.group({
            subscription            : [0, [Validators.required]],
            startDate               : ['', [Validators.required]],
            active                  : [''],
            vendor                  : [this.vendorSubscription.vendor],
        });
    }

    createVendorSubscription(form) {
        this.vendorSubscription = this.vendorSubscriptionForm.value;
        $('body').addClass('loading');
        this.vendorSubscription.subscription = this.selectedSubscription;
        this.vendorSubscription.vendor = this.vendor;
        this.vendorSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.vendorService.saveVendorSubscription(this.vendorSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.client.vendorNickName + ' ' + 'Subscription');
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendor.alias]);
                form.resetForm();
                $('#vendorSubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendor.alias]);
            form.resetForm();
            $('#vendorSubscriptionModal').modal('hide');
            this.loading = false;
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
            $('#subscriptionSelectVendor').select2({
                width: '100%'
            });
            $('#subscriptionSelectVendor').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectSubscription(selectId);
                if (selectId > 0) {
                    _self.vendorSubscriptionForm.get('subscription').setErrors(null);
                }else {
                     _self.vendorSubscriptionForm.get('subscription').setErrors({'required': true});
                }
            });
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

    loadVendor(alias) {
        this.vendorService.getVendor(alias)
        .subscribe(
        data => {
            this.vendor = data['data'][0];
            this.vendorSubscriptionForm = this.createVendorSubscriptionForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    validateForm() {
        let valid = true;

        if (this.selectedSubscription.id == 0) {
            this.vendorSubscriptionForm.get('subscription').setErrors({'required': true});
            valid = false;
        }else {
            this.vendorSubscriptionForm.get('subscription').setErrors(null);
        }
        return true;
    }

    createVendor(form){
        this.click = !this.click;
        this.createVendorSubscription(form);
        $('#vendorSubscriptionModal').modal('hide');
    }

}
