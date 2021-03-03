import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductTypeService } from '../../services/product-type.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'product-type-board.component.html'
})

export class ProductTypeBoardComponent implements OnInit {
    boardProductTypes: any = [];
    boardProductType: any= {};
    productType: any= {};
    assignedDate: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    currentUser= undefined;
    services= [];
    selectedProductType: any= {};
    loading = false;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
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
                private productTypeService: ProductTypeService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.currentPage = 1;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE);
        this.route.params.subscribe( params => {
           this.alias = params.alias;
           this.loadBoardProductTypeByProductType();
           this.loadProductType();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadClient();
    }

    loadBoardProductTypeByProductType() {
          this.loading = true;
          $('body').addClass('loading');
          this.productTypeService.getBoardTypeByProductType(this.currentPage, this.pageSize, this.query, this.alias)
          .subscribe(
              data => {
                  $('body').removeClass('loading');
                  this.boardProductTypes = data['data'];
                  this.paginationItems = this.boardProductTypes;
                  this.itemSize = this.paginationItems.length;
                  this.currentPage = data['page'];
                  this.pageSize = data['pageSize'];
                  this.totalSize = data['count'];
                  var reminder = this.totalSize % this.pageSize;
                  this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                  this.loading = false;
                  for (let i = 0; i < this.boardProductTypes.length; i++) {
                      if (this.boardProductTypes[i].assignedDate && this.boardProductTypes[i].assignedDate > 0 ) {
                          this.boardProductTypes[i].assignedDate = this.dateService.getDateString(this.boardProductTypes[i].assignedDate);
                      }else {
                          this.boardProductTypes[i].assignedDate = 'N/A';
                      }
                  }

              },
              failure => {
                  $('body').removeClass('loading');
                  this.httpResponseService.showErrorResponse(failure);
                  this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
                  this.loading = false;
              }
          );
    }

    loadProductType() {
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadBoardProductTypeByProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadBoardProductTypeByProductType();
    }

    dispatchProductType() {
        this.selectedProductType = this.productType;
        $('#boardManufacturerModal').modal('show');
    }

    reloadProductType() {
        this.loadBoardProductTypeByProductType();
    }

    showBoard(boardProductType) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, boardProductType.alias]);
    }

    searchProductTypeBoard(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadBoardProductTypeByProductType();
        }else {
            this.query = '';
            this.loadBoardProductTypeByProductType();
        }
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName+ ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST, true);
            this.breadCrumService.pushStep(PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_BOARD, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_BOARD, false);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }
}
