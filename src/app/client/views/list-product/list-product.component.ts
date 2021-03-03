import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { ClientService } from '../../services/client.service';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list-product.component.html'
})

export class ListProductComponent implements OnInit {
    products: any = [];
    product: any= {};
    alias: any= {};
    form: any= {};
    client: any= {};
    manufacturerDate: any= {};
    clientProducts: any= [];
    clientProduct: any= {};
    services= [];
    currentUser=undefined;
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.PRODUCT,
        pageTitle: CLIENT_CONSTANTS.LABEL.PRODUCT_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.PRODUCT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private dateService: DateService,
                private clientService: ClientService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.PRODUCT_LIST);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.loadAllProducts();
        this.loadClient();
    }

    loadAllProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientService.getAllProducts(this.currentPage, this.pageSize, this.query)
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
                this.tooltipService.enable();
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].manufacturerDate && this.products[i].manufacturerDate > 0 ) {
                        this.products[i].manufacturerDate = this.dateService.getDateString(this.products[i].manufacturerDate);
                    }else{
                        this.products[i].manufacturerDate = 'N/A';
                    }

                }
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST_PRODUCT]);
                this.loading = false;
            }
        );
    }


    changePage(event) {
        this.currentPage = event;
        this.loadAllProducts();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadAllProducts();
    }

    searchProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadAllProducts();
        }else {
            this.query = '';
            this.loadAllProducts();
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

    loadClient() {
       this.clientService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', CLIENT_CONSTANTS.URL.CLIENT_LIST_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
       },
       () => {
           this.loading = false;
       });
    }
}
