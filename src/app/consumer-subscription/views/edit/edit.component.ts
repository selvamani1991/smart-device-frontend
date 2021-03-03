import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { CONSUMER_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ConsumerSubscriptionService } from '../../services/consumer-subscription.service';
import { AdminService } from '../../../shared/services/admin.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    consumerSubscription: any= {};
    consumerSubscriptions: any= [];
    consumerSubscriptionForm: FormGroup;
    CONSUMER_SUBSCRIPTION_CONSTANTS= CONSUMER_SUBSCRIPTION_CONSTANTS;
    CONSUMER_SUBSCRIPTION_VALIDATOR= CONSUMER_SUBSCRIPTION_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION,
        pageTitle: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_EDIT,
        pageDesc: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_EDIT_DESC
    };
    steps= [];
    buttonName= CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_ACTION_EDIT;
    backUrl= CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorConsumerSubscriptionname: false,
        duplicateErrorEmail: false
    };
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consumerSubscriptionService: ConsumerSubscriptionService,
    private adminService: AdminService,
    private httpResponseService: HttpResponseService,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private _formBuilder: FormBuilder,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_SUBSCRIPTION_CONSTANTS = CONSUMER_SUBSCRIPTION_CONSTANTS;
        this.CONSUMER_SUBSCRIPTION_VALIDATOR = CONSUMER_SUBSCRIPTION_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_LIST_LINK, CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_EDIT_LINK, CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadConsumerSubscription(this.alias);
        });
    }

    ngOnInit() {
        this.consumerSubscriptionForm = this.createConsumerSubscriptionForm();
    }

    createConsumerSubscriptionForm(): FormGroup {
        return this.consumerSubscriptionForm = this._formBuilder.group({
            id                    : [this.consumerSubscription.id],
            ownerId               : [this.consumerSubscription.ownerId],
            alias                 : [this.consumerSubscription.alias],
            name                  : [this.consumerSubscription.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.consumerSubscription.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            price                 : [this.consumerSubscription.price, [Validators.required, Validators.minLength(2),Validators.pattern('^[0-9]{1,4}$')]],
            duration              : [this.consumerSubscription.duration, [Validators.required, Validators.minLength(2)]],
            deviceCount           : [this.consumerSubscription.deviceCount, [Validators.required, Validators.minLength(2),Validators.pattern('^[0-9]{1,4}$')]],
        });

    }

    loadConsumerSubscription(alias) {
        this.consumerSubscriptionService.getConsumerSubscription(alias)
        .subscribe(
        data => {
            this.consumerSubscription = data['data'][0];
            this.consumerSubscriptionForm = this.createConsumerSubscriptionForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    updateConsumerSubscription() {
        this.consumerSubscription = this.consumerSubscriptionForm.value;
        $('body').addClass('loading');
        this.consumerSubscriptionService.updateConsumerSubscription(this.consumerSubscription)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    list() {
        this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
    }
}
