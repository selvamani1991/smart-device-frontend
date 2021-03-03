import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ClientService } from '../../services/client.service';
import { ERROR_CODE } from '../../../constants';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'new-product-type-list.component.html'
})

export class NewProductTypeListComponent implements OnInit {
    form: any= {};
    services= [];
    productTypes: any= [];
    selectedProductType= {};
    boardManufacturer: any= {};
    selectedBoardManufacturer: any= {};
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
                private clientService: ClientService,
                private alertService: AlertService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_NEW_PRODUCT_TYPE_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_NEW_PRODUCT_TYPE_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);

    }

    ngOnInit() {
        this.loadProductTypes();
    }

    loadProductTypes() {
         this.loading = true;
         $('body').addClass('loading');
         this.clientService.getProductTypes(this.currentPage, this.pageSize)
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
              for (var i = 0; i < this.productTypes.length; i++){
                  if (this.productTypes[i].dispatchDate && this.productTypes[i].dispatchDate > 0 ){
                       this.productTypes[i].dispatchDate = this.dateService.getDateString(this.productTypes[i].dispatchDate);
                  }else{
                      this.productTypes[i].dispatchDate = 'N/A';
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
        this.loadProductTypes();
    }

    dispatchProductType() {
        this.selectedBoardManufacturer = this.boardManufacturer;
    }
}
