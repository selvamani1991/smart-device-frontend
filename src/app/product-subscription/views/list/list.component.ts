import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductSubscriptionService } from '../../services/product-subscription.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { CITY_CONSTANTS } from '../../../city/constants';
import { USER_CONSTANTS } from '../../../user/constants';
declare var $: any;
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    productSubscriptions: any = [];
    users= [];
    productSubscription: any= {};
    admin: any= {};
    alias: any= {};
    form: any= {};
    productSubscriptionDetails: any= [];
    services= [];
    loading = false;
    PRODUCT_SUBSCRIPTION_CONSTANTS= PRODUCT_SUBSCRIPTION_CONSTANTS;
    CITY_CONSTANTS= CITY_CONSTANTS;
    USER_CONSTANTS= USER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION,
        pageTitle: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST,
        pageDesc: PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private productSubscriptionService: ProductSubscriptionService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_SUBSCRIPTION_CONSTANTS = PRODUCT_SUBSCRIPTION_CONSTANTS;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION_LIST_LINK, PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_SUBSCRIPTION_CONSTANTS.LABEL.PRODUCT_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductSubscriptions();
        });
    }

    ngOnInit() {
        this.loadProductSubscriptions();
    }

    loadProductSubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.productSubscriptionService.getAllProductSubscriptions(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productSubscriptions = data['data'];
            this.paginationItems = this.productSubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

             this.tooltipService.enable();

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
           this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadProductSubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadProductSubscriptions();
    }

    addProductSubscription() {
        this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_CREATE]);
    }

    edit(productSubscription) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_EDIT, productSubscription.alias]);
    }

    show(productSubscription) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_SHOW, productSubscription.alias]);
    }

    markDeleted(productSubscription) {
        this.sweetAlertService.deleteCheck(this, productSubscription);
    }

    remove(productSubscription) {
        this.productSubscriptionService.deleteProductSubscription(productSubscription.aliasthis.productSubscription)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                productSubscription.isDeleted = true;
                productSubscription.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
                this.loadProductSubscriptions();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    reloadList() {
        this.loadProductSubscriptions();
    }

    changeStatus(productSubscription, status) {
        productSubscription.active = status;
        this.productSubscriptionService.updateProductSubscription(productSubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_SUBSCRIPTION_CONSTANTS.URL.PRODUCT_SUBSCRIPTION_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == PRODUCT_SUBSCRIPTION_CONSTANTS.FIELD.NAME) {
                form.form.controls[PRODUCT_SUBSCRIPTION_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchProductSubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadProductSubscriptions();
        }else {
            this.query = '';
            this.loadProductSubscriptions();
        }
    }
}
