import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { CONSUMER_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ConsumerSubscriptionService} from '../../services/consumer-subscription.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    consumerSubscription: any= {};
    services: any= [];
    consumerSubscriptionForm: FormGroup;
    CONSUMER_SUBSCRIPTION_CONSTANTS= CONSUMER_SUBSCRIPTION_CONSTANTS;
    CONSUMER_SUBSCRIPTION_VALIDATOR= CONSUMER_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_IMAGES,
        pageTitle: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_SHOW,
        pageDesc: CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consumerSubscriptionService: ConsumerSubscriptionService,
    private _formBuilder: FormBuilder,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CONSUMER_SUBSCRIPTION_CONSTANTS = CONSUMER_SUBSCRIPTION_CONSTANTS;
        this.CONSUMER_SUBSCRIPTION_VALIDATOR = CONSUMER_SUBSCRIPTION_VALIDATOR;
        breadCrumService.pushStep(CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_LIST_LINK, CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION_SHOW_LINK, CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_SUBSCRIPTION_CONSTANTS.LABEL.CONSUMER_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadConsumerSubscription();
        });
    }

    ngOnInit() {
        this.loadConsumerSubscription();
        this.consumerSubscriptionForm = this.createConsumerSubscriptionForm();

    }

    createConsumerSubscriptionForm(): FormGroup {
        return this.consumerSubscriptionForm = this._formBuilder.group({
            id                    : [this.consumerSubscription.id],
            name                  : [this.consumerSubscription.name, []],
            description           : [this.consumerSubscription.description, []],
            deviceCount           : [this.consumerSubscription.deviceCount, []],
            duration              : [this.consumerSubscription.duration, []],
            price                 : [this.consumerSubscription.price, []],

        });
    }

    loadConsumerSubscription() {
        $('body').addClass('loading');
        this.consumerSubscriptionService.getConsumerSubscription(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerSubscription = data['data'][0];
            this.consumerSubscriptionForm = this.createConsumerSubscriptionForm();

        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CONSUMER_SUBSCRIPTION_CONSTANTS.URL.CONSUMER_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }
}
