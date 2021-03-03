import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE } from '../../../../constants';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { ConsumerProductTypeService } from '../../services/consumer-product-type.service';
import { ERROR_CODE } from '../../../../constants';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

import { TooltipService } from '../../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    users= [];
    form: any= {};
    consumerProductType: any= {};
    consumerProductTypes: any= [];
    services= [];
    cities= [];
    loading = false;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE,
        pageTitle: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST,
        pageDesc: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private consumerProductTypeService: ConsumerProductTypeService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST, true);
        // breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_CREATE_LINK,CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_CREATE,false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE);
   }

   ngOnInit() {
       this.loadConsumerProductType();
   }

   loadConsumerProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.consumerProductTypeService.getAllConsumerProductTypes(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.consumerProductTypes = data['data'];
                this.paginationItems = this.consumerProductTypes;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                let reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;

                 this.tooltipService.enable();
            },
            failure => {
                   $('body').removeClass('loading');
                   this.httpResponseService.showErrorResponse(failure);
                   this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
                   this.loading = false;
            }
        );
   }

   changePage(event) {
        this.currentPage = event;
        this.loadConsumerProductType();
   }

   changePageSize(event) {
        this.pageSize = event;
        this.loadConsumerProductType();
   }

   addConsumerProductType() {
        this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_CREATE]);
   }

   edit(consumerProductType) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_EDIT, consumerProductType.alias]);
   }

   show(consumerProductType) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_SHOW, consumerProductType.alias]);
   }

   markDeleted(consumerProductType) {
         this.sweetAlertService.deleteCheck(this, consumerProductType);
   }

   remove(consumerProductType) {
        this.consumerProductTypeService.deleteConsumerProductType(consumerProductType.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                consumerProductType.isDeleted = true;
                consumerProductType.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.loadConsumerProductType();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            this.loading = false;
        });
   }

   changeStatus(consumerProductType, status) {
        consumerProductType.active = status;
        this.consumerProductTypeService.updateConsumerProductType(consumerProductType)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            this.loading = false;
        });
   }

   assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_PRODUCT_TYPE_CONSTANTS.FIELD.NAME) {
                form.form.controls[CONSUMER_PRODUCT_TYPE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
   }

   searchConsumerProductType(newValue) {
       let myModel = newValue;
       if (myModel.length > 2) {
           this.query = myModel;
           this.currentPage=1;
           this.loadConsumerProductType();
       } else {
           this.query = '';
           this.loadConsumerProductType();
       }
   }

   showConsumerProduct(consumerProductType) {
        this.tooltipService.clear();
        this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_CONSUMER_PRODUCT_LIST, consumerProductType.alias]);
   }
}

