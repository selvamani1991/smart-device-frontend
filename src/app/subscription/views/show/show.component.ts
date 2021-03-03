import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { SubscriptionService} from '../../services/subscription.service';
import { ProductCategoryService} from '../../../product-category/services/product-category.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    productCategories= [];
    subscription: any= {};
    selectedProductCategory= {name: 0};
    subscriptionForm: FormGroup;
    selectedCurrency: any= {id: 0};
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_IMAGE,
        pageTitle: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_SHOW,
        pageDesc: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_SHOW_DESC
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
                private subscriptionService: SubscriptionService,
                private productCategoryService: ProductCategoryService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private alertService: AlertService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST, true);
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_SHOW_LINK, SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadSubscription();
            }
        );
    }

    ngOnInit() {
        this.subscriptionForm = this.createSubscriptionForm();
        this.loadProductCategory();
    }

    createSubscriptionForm(): FormGroup {
        this.selectedProductCategory = this.subscription.productCategory ? this.subscription.productCategory : {};
        return this.subscriptionForm = this._formBuilder.group({
                id               : [this.subscription.id],
                name             : [this.subscription.name, []],
                description      : [this.subscription.description],
                price            : [this.subscription.price],
                alias            : [this.subscription.alias],
                duration         : [this.subscription.duration],
                machineTypeCount : [this.subscription.machineTypeCount],
                machineCount     : [this.subscription.machineCount],
                maxUsages        : [this.subscription.maxUsages],
                elapsedPeriod    : [this.subscription.elapsedPeriod],
                salesPercentage  : [this.subscription.salesPercentage],
                costPerMachine   : [this.subscription.costPerMachine],
                currency         : [this.subscription.currency ? this.subscription.currency.name : ''],
                productCategory  : [this.subscription.productCategory ? this.selectedProductCategory.name : 0],
                file                  : ['', []]
        });
    }

    loadSubscription() {
        $('body').addClass('loading');
        this.subscriptionService.getSubscription(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.subscription = data['data'][0];
            this.subscriptionForm = this.createSubscriptionForm();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            this.loading = false;
        } );

    }

    processFile() {
        $('body').addClass('loading');
        this.subscriptionService.uploadImage(this.files, this.subscription.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.subscription = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity)
        },
        error => {
            $('body').removeClass('loading');
            this.assignResponseError(error);
         });
    }

    assignResponseError(error){
        if (error.error.error.errorCode == ERROR_CODE.code_25) {
              this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
        }

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

    loadProductCategory() {
        this.productCategoryService.getProductCategory(this.alias)
        .subscribe(
        data => {
            this.productCategories = data['data'][0];

        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    markDeleted(subscription) {
        this.sweetAlertService.deleteCheck(this, subscription);
    }

    remove() {
       this.subscription.logo=null;
       this.subscriptionService.deleteProfilePicture(this.subscription)
       .subscribe(
       data => {
           if (!data['hasError']) {
               this.sweetAlertService.deleteImage(this.setting.entity);
           }
       },
       error => {
           this.alertService.error(error.message);
           this.loading = false;
       });
    }

}
