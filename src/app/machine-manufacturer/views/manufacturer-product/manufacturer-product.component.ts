import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { MachineManufacturerProductService } from '../../services/machine-manufacturer-product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'manufacturer-product.component.html'
})

export class ManufacturerProductComponent implements OnInit {
    manufacturers: any = [];
    manufacturer: any= {};
    product: any= {};
    manufacturerDetails: any= [];
    manufacturerProducts: any= [];
    selectedProduct: any= {};
    services= [];
    loading = false;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    constructor(
                private router: Router,
                private machineManufacturerProductService: MachineManufacturerProductService,
                breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_MANUFACTURER_PRODUCT, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER);
    }

    ngOnInit() {
        this.loadManufacturerProduct();
    }

    loadManufacturerProduct() {
        this.loading = true;
        $('body').addClass('loading');
        this.machineManufacturerProductService.getAllManufacturerProducts(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.manufacturerProducts = data['data'];
            this.paginationItems = this.manufacturerProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_NEW_MANUFACTURER_PRODUCT]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadManufacturerProduct();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadManufacturerProduct();
    }

    addManufacturer() {
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_CREATE]);
    }

    dispatchProduct(manufacturerProduct) {
        this.selectedProduct = manufacturerProduct.product;
    }
}
