import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DISTRIBUTOR_CONSTANTS } from '../../constants';
import {DISTRIBUTOR_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorService } from '../../services/distributor.service';
import { DateService } from '../../../shared/services/date.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { AdminService } from '../../../shared/services/admin.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'distributor-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'distributor-subscription-modal.component.html'
})
export class DistributorSubscriptionModalComponent implements OnInit {
    subscription: any= {};
    distributorSubscriptionForm: FormGroup;
    @Input() distributorSubscription;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    subscriptions: any= [];
    distributorSubscriptions: any= [];
    selectedSubscription= {id: 0};
    loading = false;
    click = false;
    startDate: any= {};
    distributor: any= {};
    alias: any= {};
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    DISTRIBUTOR_SUBSCRIPTION_VALIDATOR= DISTRIBUTOR_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SUBSCRIPTION,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_CREATE;
    buttonName1= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_EDIT;
    backUrl= DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private dateService: DateService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private distributorService: DistributorService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadDistributor(this.alias);
        });
    }

    ngOnInit() {
        var self=this;
        $('#distributorSubscriptionModal').on('hidden.bs.modal', function(){
            self.distributorSubscriptionForm = self.createDistributorSubscriptionForm();
            self.loadSubscription();
        });
        this.loadSubscription();
        $('#subscriptionSelect').select2({
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
        this.distributorSubscriptionForm = this.createDistributorSubscriptionForm();
    }

    createDistributorSubscriptionForm(): FormGroup {
        return this.distributorSubscriptionForm = this._formBuilder.group({
            subscription            : [0, [Validators.required]],
            startDate               : ['', [Validators.required]],
            active                  : ['', [Validators.required]],
            distributor             : [this.distributorSubscription.distributor],
            alias                   : [this.distributorSubscription.alias],
        });
    }

    createDistributorSubscription(form) {
        this.distributorSubscription = this.distributorSubscriptionForm.value;
        $('body').addClass('loading');
        this.distributorSubscription.subscription = this.selectedSubscription;
        this.distributorSubscription.distributor = this.distributor;
        this.distributorSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.distributorService.saveDistributorSubscription(this.distributorSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.client.distributorNickName + ' ' +'Subscription');
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributor.alias]);
                form.resetForm();
                $('#distributorSubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, this.distributor.alias]);
            $('#distributorSubscriptionModal').modal('hide');
            form.resetForm();
            this.loading = false;
        });
    }

    loadSubscription() {
        let _self = this;
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
            $('#subscriptionSelect').select2({
                width: '100%'
            });
            $('#subscriptionSelect').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectSubscription(selectId);
                if (selectId > 0) {
                    _self.distributorSubscriptionForm.get('subscription').setErrors(null);
                }else {
                     _self.distributorSubscriptionForm.get('subscription').setErrors({'required': true});
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
                this.distributorSubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    loadDistributor(alias) {
        this.distributorService.getDistributor(alias)
        .subscribe(
        data => {
            this.distributor = data['data'][0];
            this.distributorSubscriptionForm = this.createDistributorSubscriptionForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    validateForm() {
        let valid = true;

        if (this.selectedSubscription.id == 0) {
            this.distributorSubscriptionForm.get('subscription').setErrors({'required': true});
            valid = false;
        } else {
            this.distributorSubscriptionForm.get('subscription').setErrors(null);
        }
        return true;
    }

    createDistributor(form){
        this.click = !this.click;
        this.createDistributorSubscription(form);
        $('#distributorSubscriptionModal').modal('hide');
    }

}
