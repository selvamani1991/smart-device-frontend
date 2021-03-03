import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CLIENT_CONSTANTS } from '../../constants';
import {CLIENT_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { DateService } from '../../../shared/services/date.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { AdminService } from '../../../shared/services/admin.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'client-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'client-subscription-modal.component.html'
})
export class ClientSubscriptionModalComponent implements OnInit {
    subscription: any= {};
    clientSubscriptionForm: FormGroup;
    @Input() clientSubscription;
    @Output() submitEvent = new EventEmitter<number>();
    subscriptions: any= [];
    clientSubscriptions: any= [];
    selectedSubscription= {id: 0};
    loading = false;
    click = false;
    startDate: any= {};
    client: any= {};
    alias: any= {};
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CLIENT_SUBSCRIPTION_VALIDATOR= CLIENT_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION,
    };
    steps= [];
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_CREATE;
    buttonName1= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_EDIT;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_LIST;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private dateService: DateService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private clientService: ClientService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadClient(this.alias);
        });
    }

    ngOnInit() {
        var self = this;
        this.clientSubscriptionForm = this.createClientSubscriptionForm();
        $('#clientSubscriptionModal').on('hidden.bs.modal', function(){
            self.clientSubscriptionForm = self.createClientSubscriptionForm();
            self.loadSubscription();
        });
        this.loadSubscription();
        $('#clientSubscriptionStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 this.clientSubscriptionForm.get('startDate').setErrors(null);
            }
        });
    }

    createClientSubscriptionForm(): FormGroup {
        return this.clientSubscriptionForm = this._formBuilder.group({
            subscription            : [0, [Validators.required]],
            startDate               : ['', [Validators.required]],
            active                  : [''],
            client                  : [this.clientSubscription.client],
        });
    }

    createClientSubscription(form) {
        this.clientSubscription = this.clientSubscriptionForm.value;
        $('body').addClass('loading');
        this.clientSubscription.subscription = this.selectedSubscription;
        this.clientSubscription.client = this.client;
        this.clientSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.clientService.saveClientSubscription(this.clientSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']){
                this.adminService.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.client.alias]);
                this.formReset(form);
                $('#clientSubscriptionModal').modal('hide');
                this.submitEvent.emit(1);

            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.formReset(form);
            $('#clientSubscriptionModal').modal('hide');
            this.loading = false;
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.client.alias]);
        });
    }

    formReset(form){
        form.resetForm();
        $('#subscriptionSelect').val(0).trigger('change.select2');
    }

    loadSubscription() {
        var _self = this;
        this.clientService.getSubscription()
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
            setTimeout(function(){
                $('#subscriptionSelect').select2({
                    width: '100%'
                });
                $('#subscriptionSelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);
                    if (selectId > 0) {
                        _self.clientSubscriptionForm.get('subscription').setErrors(null);
                    }else {
                        _self.clientSubscriptionForm.get('subscription').setErrors({'required': true});
                    }
                });
            },1000);

        },
        () => {
            this.loading = false;
        } );

    }

    selectSubscription(subscriptionId){
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].id == subscriptionId) {
                this.selectedSubscription = this.subscriptions[i];
                this.clientSubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    loadClient(alias) {
        this.clientService.getClient(alias)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.clientSubscriptionForm = this.createClientSubscriptionForm();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    validateForm() {
        let valid = true;
        if (this.selectedSubscription.id == 0) {
            this.clientSubscriptionForm.get('subscription').setErrors({'required': true});
            valid = false;
        }else {
            this.clientSubscriptionForm.get('subscription').setErrors(null);
        }
        return valid;
    }

    createClient(form){
        this.click = !this.click;
        this.createClientSubscription(form);
        $('#clientSubscriptionModal').modal('hide');
    }
}
