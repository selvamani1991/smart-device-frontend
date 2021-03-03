import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { COMPANY_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { CompanyService } from '../../services/company.service';
import { AdminService } from '../../../shared/services/admin.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'subscription-edit.component.html'
})

export class SubscriptionEditComponent implements OnInit {
    loading = false;
    companySubscription: any= {};
    subscriptions: any= [];
    subscription: any= {};
    currentUser=undefined;
    client: any= {};
    selectedSubscription= {id: 0};
    startDate: any= {};
    endDate: any= {};
    companySubscriptionForm: FormGroup;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    COMPANY_SUBSCRIPTION_VALIDATOR= COMPANY_SUBSCRIPTION_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION_EDIT,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_EDIT;
    backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorcompanyname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private companyService: CompanyService,
                private adminService: AdminService,
                private authenticationService: AuthenticationService,
                private subscriptionService: SubscriptionService,
                private dateService: DateService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_SUBSCRIPTION_VALIDATOR = COMPANY_SUBSCRIPTION_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompanySubscription(this.alias);
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
        $('#subscriptionCompanySelect').select2({
                width: '100%'
        });

        $('#companySubscriptionStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                  this.companySubscriptionForm.get('startDate').setErrors(null);
            }
        });
        $('#companySubscriptionEndDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.endDate = selectedDate;
                 this.companySubscriptionForm.get('endDate').setErrors(null);
            }
        });
        this.companySubscriptionForm = this.createCompanySubscriptionForm();
    }

    createCompanySubscriptionForm(): FormGroup {
        this.companySubscription.startDate = this.dateService.getDateString(this.companySubscription.startDate);
        this.companySubscription.endDate = this.dateService.getDateString(this.companySubscription.endDate);
        this.selectedSubscription = this.companySubscription.subscription ? this.companySubscription.subscription : {};
        return this.companySubscriptionForm = this._formBuilder.group({
            id                      : [this.companySubscription.id],
            ownerId                 : [this.companySubscription.ownerId],
            alias                   : [this.companySubscription.alias],
            subscription            : [this.companySubscription.subscription ? this.selectedSubscription.id : 0, [Validators.required]],
            startDate               : [this.companySubscription.startDate, [Validators.required]],
            endDate                 : [this.companySubscription.endDate, [Validators.required]],
            active                  : [this.companySubscription.active],
            company                 : [this.companySubscription.company]
        });
    }

    loadSubscription() {
        var _self = this;
        this.companyService.getSubscription()
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
            this.companySubscriptionForm = this.createCompanySubscriptionForm();
            setTimeout(function(){
                $('#subscriptionCompanySelect').select2({
                    width: '100%'
                });
                $('#subscriptionCompanySelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);
                    if (selectId > 0) {
                        _self.companySubscriptionForm.get('subscription').setErrors(null);
                    }else {
                         _self.companySubscriptionForm.get('subscription').setErrors({'required': true});
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
                this.companySubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    loadCompanySubscription(alias) {
        this.companyService.getCompanySubscriptions(alias)
        .subscribe(
        data => {
            this.companySubscription = data['data'][0];
            this.companySubscriptionForm = this.createCompanySubscriptionForm();
            this.startDate = this.companySubscription.startDate;
            this.endDate = this.companySubscription.endDate;
            this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'Subscription List', COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST_ALIAS.replace(":alias",this.companySubscription.company.alias),true);
            this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'Subscription Edit', COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_EDIT, false);
            this.steps = this.breadCrumService.getSteps();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    updateCompanySubscription() {
        this.companySubscription = this.companySubscriptionForm.value;
        $('body').addClass('loading');
        this.companySubscription.subscription = this.selectedSubscription;
        this.companySubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.companySubscription.endDate = this.dateService.getLongFromString(this.endDate);
        this.companyService.updateCompanySubscription(this.companySubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyNickName + ' ' + 'Subscription');
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.companySubscription.company.alias]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.companySubscription.company.alias]);
            this.loading = false;
        });
    }

    list(){
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.companySubscription.company.alias]);
    }

    validateForm() {
        let valid = true;
        return valid;
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.loadCompanySubscription(this.alias);
        },
        () => {
           this.loading = false;
        });
    }
}
