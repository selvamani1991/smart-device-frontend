import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ClientService } from '../../services/client.service';
import { AdminService } from '../../../shared/services/admin.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'client-subscription-edit.component.html'
})

export class ClientSubscriptionEditComponent implements OnInit {
    loading = false;
    clientSubscription: any= {};
    subscription: any= {};
    subscriptions: any= [];
    //selectedSubscription= {id: 0};
    selectedSubscription: any= {id: 0,alias:''};
    startDate: any= {};
    endDate: any= {};
    clientSubscriptionForm: FormGroup;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CLIENT_SUBSCRIPTION_VALIDATOR= CLIENT_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_EDIT,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_EDIT;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorclientname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private clientService: ClientService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CLIENT_SUBSCRIPTION_VALIDATOR = CLIENT_SUBSCRIPTION_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadClientSubscription(this.alias);
        });
    }

    ngOnInit() {
        this.clientSubscriptionForm = this.createClientSubscriptionForm();
        this.loadSubscription();
        $('#subscriptionClientSelect').select2({
            width: '100%'
        });

        $('#clientSubscriptionStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 this.clientSubscriptionForm.get('startDate').setErrors(null);
            }
        });

        $('#clientSubscriptionEndDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
                this.clientSubscriptionForm.get('endDate').setErrors(null);
            }
        });
    }

    createClientSubscriptionForm(): FormGroup {
        this.clientSubscription.startDate = this.dateService.getDateString(this.clientSubscription.startDate);
        this.clientSubscription.endDate = this.dateService.getDateString(this.clientSubscription.endDate);
        console.log(this.clientSubscription.subscription);
        this.selectedSubscription = this.clientSubscription.subscription ? this.clientSubscription.subscription.alias : '';
        return this.clientSubscriptionForm = this._formBuilder.group({
            id                    : [this.clientSubscription.id],
            alias                 : [this.clientSubscription.alias],
            subscription          : [this.selectedSubscription, [Validators.required]],
            startDate             : [this.clientSubscription.startDate, [Validators.required]],
            endDate               : [this.clientSubscription.endDate, [Validators.required]],
            active                : [this.clientSubscription.active],
            client                : [this.clientSubscription.client]

        });
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
            this.clientSubscriptionForm = this.createClientSubscriptionForm();
            setTimeout(function(){
                $('#subscriptionClientSelect').select2({
                    width: '100%'
                });
                $('#subscriptionClientSelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);
                     if (selectId > 0) {
                        _self.clientSubscriptionForm.get('subscription').setErrors(null);
                     }else {
                         _self.clientSubscriptionForm.get('subscription').setErrors({'required': true});
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
            if (this.subscriptions[i].alias == subscriptionId) {
            console.log(this.selectedSubscription);
                this.selectedSubscription = this.subscriptions[i];
                this.clientSubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    updateClientSubscription() {
        this.clientSubscription = this.clientSubscriptionForm.value;
        $('body').addClass('loading');
        this.clientSubscription.subscription = this.selectedSubscription;
        this.clientSubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.clientSubscription.endDate = this.dateService.getLongFromString(this.endDate);
        this.clientService.updateClientSubscription(this.clientSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);

            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.clientSubscription.client.alias]);

            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.clientSubscription.client.alias]);
            this.loading = false;
        });
    }

    loadClientSubscription(alias) {
        this.clientService.getClientSubscriptions(alias)
        .subscribe(
        data => {
            this.clientSubscription = data['data'][0];
            this.clientSubscriptionForm = this.createClientSubscriptionForm();
            this.startDate = this.clientSubscription.startDate;
            this.endDate = this.clientSubscription.endDate;
            this.breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_SUBSCRIPTION_LIST_ALIAS.replace(":alias",this.clientSubscription.client.alias),true);
            this.breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_SUBSCRIPTION_EDIT_LINK, CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });

    }

    list() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST, this.clientSubscription.client.alias]);
    }

    validateForm() {
         let valid = true;
         return valid;
    }
}
