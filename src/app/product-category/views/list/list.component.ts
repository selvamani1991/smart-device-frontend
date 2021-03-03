import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CATEGORY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { ProductCategoryService } from '../../services/product-category.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    productCategorys: any = [];
    users= [];
    productCategory: any= {};
    admin: any= {};
    alias: any= {};
    form: any= {};
    productCategoryDetails: any= [];
    services= [];
    loading = false;
    PRODUCT_CATEGORY_CONSTANTS= PRODUCT_CATEGORY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY,
        pageTitle: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST,
        pageDesc: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST_DESC
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
                private productCategoryService: ProductCategoryService,
                private alertService: AlertService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_CATEGORY_CONSTANTS = PRODUCT_CATEGORY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductCategorys();
        });
    }

    ngOnInit() {
        this.loadProductCategorys();
    }

    loadProductCategorys() {
        this.loading = true;
        $('body').addClass('loading');
        this.productCategoryService.getAllProductCategorys(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productCategorys = data['data'];
            this.paginationItems = this.productCategorys;
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
            this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
           this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadProductCategorys();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadProductCategorys();
    }

    addProductCategory() {
        this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_CREATE]);
    }

    edit(productCategory) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_EDIT, productCategory.alias]);
    }

    show(productCategory) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_SHOW, productCategory.alias]);
    }

    markDeleted(productCategory) {
        this.sweetAlertService.deleteCheck(this, productCategory);
    }

    remove(productCategory) {
        this.productCategoryService.deleteProductCategory(productCategory.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                productCategory.isDeleted = true;
                productCategory.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
                this.loadProductCategorys();
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
        this.loadProductCategorys();
    }

    changeStatus(productCategory, status) {
        productCategory.active = status;
        this.productCategoryService.updateProductCategory(productCategory)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == PRODUCT_CATEGORY_CONSTANTS.FIELD.NAME) {
                form.form.controls[PRODUCT_CATEGORY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchProductCategory(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadProductCategorys();
        }else {
            this.query = '';
            this.loadProductCategorys();
        }
    }
}
