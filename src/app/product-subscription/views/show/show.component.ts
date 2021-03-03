import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_SUBSCRIPTION_VALIDATOR } from '../../validator';
import { PRODUCT_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ProductSubscriptionService} from '../../services/product-subscription.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    productSubscription: any= {};
    services: any= [];
    files: any= [];
    formatError= false;
    selectedDuration= {id: 0};
    duration: any= {id: 0};
    durations = [];
    selectedElapsedPeriod= {id: 0};
    elapsedPeriod: any= {id: 0};
    elapsedPeriods = [];
    productSubscriptionForm: FormGroup;
    PRODUCT_SUBSCRIPTION_CONSTANTS= PRODUCT_SUBSCRIPTION_CONSTANTS;
    PRODUCT_SUBSCRIPTION_VALIDATOR= PRODUCT_SUBSCRIPTION_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_IMAGES,
        pageTitle: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_SHOW,
        pageDesc: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_SHOW_DESC
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
                private productSubscriptionService: ProductSubscriptionService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.PRODUCT_SUBSCRIPTION_CONSTANTS = PRODUCT_SUBSCRIPTION_CONSTANTS;
        this.PRODUCT_SUBSCRIPTION_VALIDATOR = PRODUCT_SUBSCRIPTION_VALIDATOR;
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_SHOW_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductSubscription();
        });
    }

    ngOnInit() {
        this.loadProductSubscription();
        this.productSubscriptionForm = this.createProductSubscriptionForm();

    }

    createProductSubscriptionForm(): FormGroup {
         this.selectedDuration = this.productSubscription.duration ? this.productSubscription.duration : {};
         this.selectedElapsedPeriod = this.productSubscription.elapsedPeriod ? this.productSubscription.elapsedPeriod : {};
        return this.productSubscriptionForm = this._formBuilder.group({
            id                    : [this.productSubscription.id],
            name                  : [this.productSubscription.name, []],
            description           : [this.productSubscription.description, []],
            price                 : [this.productSubscription.price, []],
            duration              : [this.productSubscription.duration, []],
            machineTypeCount      : [this.productSubscription.machineTypeCount, []],
            machineCount          : [this.productSubscription.machineCount, []],
            maxUsages             : [this.productSubscription.maxUsages, []],
            elapsedPeriod         : [this.productSubscription.elapsedPeriod, []],
            salesPercentage       : [this.productSubscription.salesPercentage, []],
            file                  : ['', []],
        });
    }

    loadProductSubscription() {
        $('body').addClass('loading');
        this.productSubscriptionService.getProductSubscription(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productSubscription = data['data'][0];
            this.productSubscriptionForm = this.createProductSubscriptionForm();
            this.productSubscription.duration = this.duration;
            this.productSubscription.elapsedPeriod = this.elapsedPeriod;

        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        this.productSubscriptionService.uploadImage(this.files, this.productSubscription.id)
        .subscribe(
        data => {
            this.productSubscription = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
        });
    }

    onFileChange(event) {
        this.files = event.target.files[0];
        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
             this.formatError = true;
            return;
        }else {
            this.formatError = false;
        }
        this.processFile();
    }
}
