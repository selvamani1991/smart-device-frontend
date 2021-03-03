import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientProductService } from '../../services/client-product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'new-client-product.component.html'
})

export class NewClientProductComponent implements OnInit {
    form: any= {};
    clientProducts: any= [];
    services= [];
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;

    constructor(
                private router: Router,
                private clientProductService: ClientProductService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.NEW_CLIENT_PRODUCT_LINK, CLIENT_CONSTANTS.URL.CLIENT_NEW_CLIENT_PRODUCT, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);

    }

    ngOnInit() {
        this.loadClientProduct();
    }

    loadClientProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientProductService.getAllClientProducts(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.clientProducts = data['data'];
            this.paginationItems = this.clientProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_NEW_CLIENT_PRODUCT]);
            this.loading = false;
        });

    }

    acceptProduct(clientProduct) {
        clientProduct.status = 'Accepted';
        this.clientProductService.updateClientProduct(clientProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_NEW_CLIENT_PRODUCT]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_NEW_CLIENT_PRODUCT]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CLIENT_CONSTANTS.FIELD.NAME) {
                form.form.controls[CLIENT_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    changePage(event) {
        this.currentPage = event;
        this.loadClientProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadClientProduct();
    }
}
