import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CONSUMER_PRODUCT_CONSTANTS } from '../../constants';
import { CONSUMER_TICKET_CONSTANTS } from '../../../consumer-ticket/constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE } from '../../../../constants';
import { DateService } from '../../../../shared/services/date.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { ConsumerProductService } from '../../services/consumer-product.service';
import { ERROR_CODE } from '../../../../constants';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
import { TELEMETRIC_DATA_CONSTANTS } from '../../../../telemetric-data/constants';
import { TooltipService } from '../../../../shared/services/tooltip.service';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../../consumer-product-type/constants';

import { ConsumerProductTypeService } from '../../../consumer-product-type/services/consumer-product-type.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'consumer-product-list.component.html'
})
export class ConsumerProductListComponent implements OnInit {
    users= [];
    form: any= {};
    product: any= {};
    alias: any= {};
    manufacturingDate: any= {};
    consumerProduct: any= {};
    consumerProductType: any= {};
    consumerProducts: any= [];
    services= [];
    loading = false;
    CONSUMER_PRODUCT_CONSTANTS= CONSUMER_PRODUCT_CONSTANTS;
    CONSUMER_TICKET_CONSTANTS= CONSUMER_TICKET_CONSTANTS;
    TELEMETRIC_DATA_CONSTANTS= TELEMETRIC_DATA_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT,
        pageTitle: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_LIST,
        pageDesc: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_LIST_DESC
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
                private consumerProductService: ConsumerProductService,
                private consumerProductTypeService: ConsumerProductTypeService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CONSUMER_PRODUCT_CONSTANTS = CONSUMER_PRODUCT_CONSTANTS;
        this.CONSUMER_TICKET_CONSTANTS = CONSUMER_TICKET_CONSTANTS;
        this.TELEMETRIC_DATA_CONSTANTS = TELEMETRIC_DATA_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST, true);
        breadCrumService.pushStep(CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_LIST_LINK, CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadConsumerProductByConsumerProductTypeId();
        });
    }

    ngOnInit() {
        this.loadConsumerProductType();
    }

    loadConsumerProductByConsumerProductTypeId() {
        this.loading = true;
        $('body').addClass('loading');
        this.consumerProductService.getAllConsumerProducts(this.currentPage, this.pageSize, this.query, this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerProducts = data['data'];
            this.paginationItems = this.consumerProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

            this.tooltipService.enable();

            for (let i = 0; i < this.consumerProducts.length; i++) {
                if (this.consumerProducts[i].manufacturingDate && this.consumerProducts[i].manufacturingDate > 0 ) {
                    this.consumerProducts[i].manufacturingDate = this.dateService.getDateString(this.consumerProducts[i].manufacturingDate);
                }else {
                    this.consumerProducts[i].manufacturingDate = 'N/A';
                }

            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST]);
            this.loading = false;
            }
        );
    }


    changePage(event) {
        this.currentPage = event;
        this.loadConsumerProductByConsumerProductTypeId();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadConsumerProductByConsumerProductTypeId();
    }

    addConsumerProduct() {
        this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CREATE, this.alias]);
    }

    edit(consumerProduct) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_EDIT, consumerProduct.alias]);
    }

    show(consumerProduct) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_PRODUCT_SHOW, consumerProduct.alias]);
    }

    list(consumerProduct) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_LIST, consumerProduct.alias]);
    }

    markDeleted(consumerProduct) {
        this.sweetAlertService.deleteCheck(this, consumerProduct);
    }

    remove(consumerProduct) {
        this.consumerProductService.deleteConsumerProduct(consumerProduct.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                consumerProduct.deleted = true;
                consumerProduct.active = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                /* this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST,this.product.productType.alias]); */
                this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.consumerProductType.alias]);
                this.loadConsumerProductByConsumerProductTypeId();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    changeStatus(consumerProduct, status) {
        consumerProduct.active = status;
        consumerProduct.manufacturingDate = this.dateService.getLongFromString(consumerProduct.manufacturingDate);
        this.consumerProductService.updateConsumerProduct(consumerProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                consumerProduct.manufacturingDate = this.dateService.getDateString(consumerProduct.manufacturingDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.product.productType.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.product.productType.alias]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_PRODUCT_CONSTANTS.FIELD.NAME) {
                form.form.controls[CONSUMER_PRODUCT_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchConsumerProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadConsumerProductByConsumerProductTypeId();
        } else {
            this.query = '';
            this.loadConsumerProductByConsumerProductTypeId();
        }
    }

    loadConsumerProductType() {
        this.consumerProductTypeService.getConsumerProductType(this.alias)
        .subscribe(
        data => {
            this.consumerProductType = data['data'][0];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST]);
            this.loading = false;
        });

    }

    showTelemetricData() {
        this.tooltipService.clear();
        this.router.navigate([TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST]);
    }
}
