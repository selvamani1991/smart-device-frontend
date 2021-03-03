import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductTypeService } from '../../services/product-type.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    productTypes: any = [];
    productType: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    services= [];
    currentUser= undefined;
    selectedProductType: any= {};
    loading = false;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_LIST,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_LIST_DESC
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
                private authenticationService: AuthenticationService,
                private productTypeService: ProductTypeService,
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE);
        this.route.params.subscribe( params => {
               this.alias = params.alias;
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

    loadProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.productTypeService.getAllProductTypes(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productTypes = data['data'];
            this.paginationItems = this.productTypes;
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
            this.loading = false;
        });
    }

    addProductType() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_CREATE]);
    }

    show(productType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_SHOW, productType.alias]);
    }

    boardProductType(productType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_BOARD, productType.alias]);
    }

    machineProductType(productType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_MACHINE, productType.alias]);
    }

    edit(productType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_EDIT, productType.alias]);
    }

    changePage(event) {
      this.currentPage = event;
      this.loadProductType();
    }

    changePageSize(event) {
      this.pageSize = event;
      this.loadProductType();
    }

    markDeleted(productType) {
        this.sweetAlertService.deleteCheck(this, productType);
    }

    remove(productType) {
        this.productTypeService.deleteProductType(productType.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                productType.isDeleted = true;
                productType.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.client.productTypeNickName);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
                this.loadProductType();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    assignBoard(productType) {
         productType.active = status;
         this.productTypeService.updateProductType(productType)
         .subscribe(
         data => {
              if (data['hasError']) {
                  this.assignResponseError(data, this.form);
              } else {
                  this.sweetAlertService.updateConfirmation(this.setting.entity);
                  this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
              }
              this.loading = false;
         },
         failure => {
              this.httpResponseService.showErrorResponse(failure);
              this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
              this.loading = false;
         });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == PRODUCT_TYPE_CONSTANTS.FIELD.NAME) {
                form.form.controls[PRODUCT_TYPE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    reloadProductType() {
        this.loadProductType();
    }

    searchProductType(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadProductType();
        }else {
            this.query = '';
            this.loadProductType();
        }
    }

    showMachine(productType) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_PRODUCT_TYPE_MACHINE, productType.alias]);
    }

    addProduct() {
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_CREATE]);
    }

    showProduct(productType) {
       this.tooltipService.clear();
       this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, productType.alias]);
    }

    showMedia(productType) {
      this.tooltipService.clear();
      this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MEDIA_LIST, productType.alias]);
    }

    showFirmware(productType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST, productType.alias]);
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST, true);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }

    changeStatus(productType, status) {
         productType.active = status;
         this.productTypeService.updateProductType(productType)
         .subscribe(
         data => {
             if (data['hasError']) {
                 this.assignResponseError(data, this.form);
             } else {
                 this.sweetAlertService.updateConfirmation(this.client.productTypeNickName);
             }
             this.loading = false;
         },
         failure => {
             this.httpResponseService.showErrorResponse(failure);
             this.loading = false;
         });
    }
}
