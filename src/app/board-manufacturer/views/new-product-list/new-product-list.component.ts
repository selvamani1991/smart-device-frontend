import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { ERROR_CODE } from '../../../constants';

@Component({
    selector: 'new-product-list.component.html',
    moduleId: module.id.toString(),
    templateUrl: 'new-product-list.component.html'
})

export class NewProductListComponent implements OnInit {
    products: any= [];
    product: any= {};
    selectedProduct= {};
    boardManufacturer: any= {};
    services= [];
    loading = false;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER,
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_NEW_PRODUCT_LIST,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_NEW_PRODUCT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 4;
    totalPages= 0;
    constructor(
                private router: Router,
                private boardManufacturerService: BoardManufacturerService,
                private alertService: AlertService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_NEW_PRODUCT_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
    }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.boardManufacturerService.getProducts(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.products = data['data'];
            this.paginationItems = this.products;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (var i = 0; i < this.products.length; i++) {
                if (this.products[i].manufacturerDate && this.products[i].manufacturerDate > 0 ) {
                    this.products[i].manufacturerDate = this.dateService.getDateString(this.products[i].manufacturerDate);
                } else {
                    this.products[i].manufacturerDate = 'N/A';
                }
            }
        },
        error => {
            $('body').removeClass('loading');
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadProducts();
    }

    dispatchProduct(product) {
        this.selectedProduct = product;
    }
}
