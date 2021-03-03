import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {COMPANY_CONSTANTS } from '../../constants';
import {COMPANY_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
import { DateService } from '../../../shared/services/date.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { AdminService } from '../../../shared/services/admin.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

declare var $: any;

@Component({
    selector: 'company-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'company-subscription-modal.component.html'
})

export class CompanySubscriptionModalComponent implements OnInit {
    subscription: any= {};
    companySubscriptionForm: FormGroup;
    @Input() companySubscription;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    subscriptions: any= [];
    companySubscriptions: any= [];
    selectedSubscription= {id: 0};
    loading = false;
    click=false;
    startDate: any= {};
    company: any= {};
    alias: any= {};
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    COMPANY_SUBSCRIPTION_VALIDATOR= COMPANY_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_SUBSCRIPTION,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_CREATE;
    buttonName1= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_EDIT;
    backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private dateService: DateService,
                private adminService: AdminService,
                private subscriptionService: SubscriptionService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private companyService: CompanyService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompany(this.alias);
        });

    }

    ngOnInit() {
        var self = this;
        this.companySubscriptionForm = this.createCompanySubscriptionForm();
        $('#companySubscriptionModal').on('hidden.bs.modal', function(){
            self.companySubscriptionForm = self.createCompanySubscriptionForm();
            self.loadSubscription();
        });

        this.loadSubscription();
        $('#subscriptionSelectCompany').select2({
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
    }

    createCompanySubscriptionForm(): FormGroup {
        return this.companySubscriptionForm = this._formBuilder.group({
            subscription            : [0, [Validators.required]],
            startDate               : ['', [Validators.required]],
            active                  : [''],
            company                 : [this.companySubscription.company],
        });
    }

    createCompanySubscription(form) {
        this.companySubscription = this.companySubscriptionForm.value;
        $('body').addClass('loading');
        this.companySubscription.subscription = this.selectedSubscription;
        this.companySubscription.company = this.company;
        this.companySubscription.startDate = this.dateService.getLongFromString(this.startDate);
        this.companyService.saveCompanySubscription(this.companySubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.client.companyNickName + ' ' + 'Subscription');
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.company.alias]);
                form.resetForm();
                $('#companySubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST, this.company.alias]);
            form.resetForm();
            $('#companySubscriptionModal').modal('hide');

            this.loading = false;
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
            $('#subscriptionSelectCompany').select2({
                width: '100%'
            });
            $('#subscriptionSelectCompany').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectSubscription(selectId);
                if (selectId > 0) {
                    _self.companySubscriptionForm.get('subscription').setErrors(null);
                }else {
                     _self.companySubscriptionForm.get('subscription').setErrors({'required': true});
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
                this.companySubscriptionForm.get('subscription').setErrors(null);
            }
        }
    }

    loadCompany(alias) {
        this.companyService.getCompany(alias)
        .subscribe(
        data => {
            this.company = data['data'][0];
            this.companySubscriptionForm = this.createCompanySubscriptionForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    validateForm() {
        let valid = true;

        if (this.selectedSubscription.id == 0) {
            this.companySubscriptionForm.get('subscription').setErrors({'required': true});
            valid = false;
        }else {
            this.companySubscriptionForm.get('subscription').setErrors(null);
        }
        return true;
    }

    submitCompany(form){
        this.click=!this.click;
        this.createCompanySubscription(form);
        $('#companySubscriptionModal').modal('hide');
    }

}
