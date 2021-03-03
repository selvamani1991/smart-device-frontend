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
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    productTypes: any= [];
    boardManufacturers: any = [];
    users= [];
    client: any= {};
    form: any= {};
    currentUser=undefined;
    boardManufacturer: any= {};
    boardManufacturerDetails: any= [];
    services= [];
    cities= [];
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
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private boardManufacturerService: BoardManufacturerService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
   }

   ngOnInit() {
       this.loadBoardManufacturer();
       this.loadClient();
   }

   loadBoardManufacturer() {
        this.loading = true;
        $('body').addClass('loading');
        this.boardManufacturerService.getAllBoardManufacturers(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
                $('body').removeClass('loading');
                this.boardManufacturers = data['data'];
                this.paginationItems = this.boardManufacturers;
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
               this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
               this.loading = false;
        });
   }

   changePage(event) {
        this.currentPage = event;
        this.loadBoardManufacturer();
   }

   changePageSize(event) {
        this.pageSize = event;
        this.loadBoardManufacturer();
   }

   addBoardManufacturer() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_CREATE]);
   }

   edit(boardManufacturer) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_EDIT, boardManufacturer.alias]);
   }

   show(boardManufacturer) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_SHOW, boardManufacturer.alias]);
   }

   markDeleted(boardManufacturer) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, boardManufacturer);
   }

   remove(boardManufacturer) {
        $('body').addClass('loading');
        this.boardManufacturerService.deleteBoardManufacturer(boardManufacturer.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                boardManufacturer.isDeleted = true;
                boardManufacturer.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.loadBoardManufacturer();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });
   }

   changeStatus(boardManufacturer, status) {
        boardManufacturer.active = status;
        this.boardManufacturerService.updateBoardManufacturer(boardManufacturer)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
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

   searchBoardManufacturer(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadBoardManufacturer();
        } else {
            this.query = '';
            this.loadBoardManufacturer();
        }
   }

   changePassword(boardManufacturer) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_CHANGE_PASSWORD, boardManufacturer.alias]);
   }


    loadClient() {
        this.boardManufacturerService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];

        },
        () => {
           this.loading = false;
        });
    }
}
