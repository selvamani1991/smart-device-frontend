import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BOARD_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { BoardService } from '../../services/board.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'board-list.component.html'
})

export class BoardListComponent implements OnInit {
    boards: any = [];
    currentUser: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    boardProductType: any= {};
    services= [];
    loading = false;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_CONSTANTS.LABEL.BOARD,
        pageTitle: BOARD_CONSTANTS.LABEL.BOARD_LIST,
        pageDesc: BOARD_CONSTANTS.LABEL.BOARD_LIST_DESC
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
                private authenticationService: AuthenticationService,
                private boardService: BoardService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_CONSTANTS.LABEL.BOARD);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
        this.route.params.subscribe( params => {
            this.alias = params.alias;

        });
    }

    ngOnInit() {
        this.loadBoardByBoardProductType();
        this.loadBoardProductType();
        this.loadClient();
    }

    loadBoardByBoardProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.boardService.getBoardByBoardProductType(this.currentPage, this.pageSize, this.query, this.alias)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.boards = data['data'];
                this.paginationItems = this.boards;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                var reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                this.tooltipService.clear();
                for (let i = 0; i < this.boards.length; i++) {
                    if (this.boards[i].manufacturerDate && this.boards[i].manufacturerDate > 0 ) {
                        this.boards[i].manufacturerDate = this.dateService.getDateString(this.boards[i].manufacturerDate);
                    }else {
                        this.boards[i].manufacturerDate = 'N/A';
                    }
                }
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([BOARD_CONSTANTS.URL.BOARD_BOARD_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadBoardByBoardProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadBoardByBoardProductType();
    }

    addBoard() {
        this.router.navigate([BOARD_CONSTANTS.URL.BOARD_CREATE, this.alias]);
    }

    edit(board) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_CONSTANTS.URL.BOARD_EDIT, board.alias]);
    }

    show(board) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_CONSTANTS.URL.BOARD_SHOW, board.alias]);
    }

    markDeleted(board) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, board);
    }

    remove(board) {
        $('body').addClass('loading');
        this.boardService.deleteBoard(board.alias)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                board.isDeleted = true;
                board.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.loadBoardByBoardProductType();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_CONSTANTS.URL.BOARD_BOARD_LIST]);
            this.loading = false;
        });
    }

    assignBoard(board) {
        board.status = 'Dispatched';
        board.changeStatus=true;
         $('body').addClass('loading');
        board.manufacturerDate = this.dateService.getLongFromString(board.manufacturerDate);
        this.boardService.updateAssignBoard(board)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                board.manufacturerDate = this.dateService.getDateString(board.manufacturerDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, board.productType.alias]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, board.productType.alias]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == BOARD_CONSTANTS.FIELD.BOARDID) {
                form.form.controls[BOARD_CONSTANTS.FIELD.BOARDID_FIELD].setErrors({'duplicate': true});
            }
        }
    }

    searchBoard(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadBoardByBoardProductType();
        } else {
            this.query = '';
            this.loadBoardByBoardProductType();
        }
    }

    loadBoardProductType() {
        this.boardService.getBoardProductType(this.alias)
        .subscribe(
        data => {
            this.boardProductType = data['data'][0];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_CONSTANTS.URL.BOARD_BOARD_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.boardService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Board' + ' ' + this.client.productTypeNickName + ' ' + 'List', BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE, true);
           this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, BOARD_CONSTANTS.URL.BOARD_BOARD_LIST, false);
           this.steps = this.breadCrumService.getSteps();

        },
        () => {
           this.loading = false;
        });
    }
}
