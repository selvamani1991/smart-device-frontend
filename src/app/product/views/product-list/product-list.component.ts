import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductService } from '../../services/product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'product-list.component.html'
})

export class ProductListComponent implements OnInit {
    products: any = [];
    users= [];
    product: any= {};
    productType: any= {};
    client: any= {};
    currentUser= undefined;
    alias: any= {};
    form: any= {};

    selectedProduct: any= {};
    manufacturerDate: any= {};
    clientProducts: any= [];
    clientProduct: any= {};
    services= [];
    loading = false;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_CONSTANTS.LABEL.PRODUCT,
        pageTitle: PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST,
        pageDesc: PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private alertService: AlertService,
                private dateService: DateService,
                private productTypeService: ProductTypeService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductByProductTypeId();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadProductType();
        this.loadClient();
    }

    loadProductByProductTypeId() {
        this.loading = true;
        $('body').addClass('loading');
        this.productService.getProducts(this.currentPage, this.pageSize, this.query, this.alias)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.products = data['data'];
                this.paginationItems = this.products;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                let reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                this.tooltipService.enable();
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].manufacturerDate && this.products[i].manufacturerDate > 0 ) {
                        this.products[i].manufacturerDate = this.dateService.getDateString(this.products[i].manufacturerDate);
                    }else {
                        this.products[i].manufacturerDate = 'N/A';
                    }

                }

            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
                this.loading = false;
            }
        );
    }

    addProduct() {
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_CREATE, this.alias]);
    }

    showProduct(product) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_SHOW, product.alias]);
    }

    edit(product) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_EDIT, product.alias]);
    }

    changePage(event) {
        this.currentPage = event;
        this.loadProductByProductTypeId();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadProductByProductTypeId();
    }

    markDeleted(product) {
        this.sweetAlertService.deleteCheck(this, product);
    }

    remove(product) {
        this.productService.deleteProduct(product)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                product.isDeleted = true;
                product.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.client.productNickName);
                this.loadProductByProductTypeId();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    dispatchProduct(product) {
        this.selectedProduct = product;
        $('#vendorAssignModal').modal('show');
    }

    dispatchCompanyProduct(product) {
        this.selectedProduct = product;
        $('#companyAssignModal').modal('show');
    }

    reloadProduct() {
        this.loadProductByProductTypeId();
    }

    changeStatus(product, status) {
        product.active = status;
        product.manufacturerDate = this.dateService.getLongFromString(product.manufacturerDate);
        this.productService.updateProduct(product)
        .subscribe(
        data => {
            if (data['hasError']) {
               this.assignResponseError(data, this.form);
            } else {
               product.manufacturerDate = this.dateService.getDateString(product.manufacturerDate);
               this.sweetAlertService.updateConfirmation(this.client.productNickName);
            }
            this.loading = false;
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === PRODUCT_CONSTANTS.FIELD.NAME) {
                form.form.controls[PRODUCT_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadProductByProductTypeId();
        } else {
            this.query = '';
            this.loadProductByProductTypeId();
        }
    }

    show(product) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_TELEMETRIC_DATA, product.alias]);
    }

    showErrorData(product) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_ERROR_DATA, product.alias]);
    }

    showProductData(product) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_DATA_LIST, product.alias]);
    }

    loadProductType() {
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST, true);
            this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST, false);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }

    replaceText(text){
        text= text.replace('Product', this.client.productNickName?this.client.productNickName:'Product');
        return text;

    }
}
