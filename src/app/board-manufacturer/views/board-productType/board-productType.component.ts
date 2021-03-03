import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { BoardProductService } from '../../services/board-product.service';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'board-productType.component.html'
})

export class BoardProductTypeComponent implements OnInit {
    boardProductType: any= {};
    form: any= {};
    boardProductTypes: any= [];
    client: any= {};
    currentUser: any= {};
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
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private boardProductService: BoardProductService,
                private authenticationService: AuthenticationService,
                private boardManufacturerService: BoardManufacturerService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        this.loadBoardProductType();
        this.loadClient();
    }

    loadBoardProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.boardProductService.getAllBoardProductTypes(this.currentPage, this.pageSize, this.query)
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
            this.tooltipService.enable();
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
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
            this.loading = false;
        });

    }

    acceptProductType(boardProductType) {
        boardProductType.status = 'Accepted';
        $('body').addClass('loading');
        this.boardProductService.updateBoardProductType(boardProductType)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == BOARD_MANUFACTURER_CONSTANTS.FIELD.NAME) {
                form.form.controls[BOARD_MANUFACTURER_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    changePage(event) {
        this.currentPage = event;
        this.loadBoardProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadBoardProductType();
    }

    show(boardProductType) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE_SHOW, boardProductType.alias]);
    }

    showBoard(boardProductType) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, boardProductType.alias]);
    }

    changeStatus(boardProductType, status) {
        boardProductType.active = status;
        $('body').addClass('loading');
        boardProductType.assignedDate = this.dateService.getLongFromString(boardProductType.assignedDate);
        this.boardProductService.updateBoardProductType(boardProductType)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                boardProductType.assignedDate = this.dateService.getDateString(boardProductType.assignedDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
            }
            this.loading = false;
        },
        failure => {
             $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
            this.loading = false;
        });
    }

    searchBoardProductType(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadBoardProductType();
        } else {
            this.query = '';
            this.loadBoardProductType();
        }
    }

    loadClient() {
        this.boardManufacturerService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Board' + ' ' + this.client.productTypeNickName, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
