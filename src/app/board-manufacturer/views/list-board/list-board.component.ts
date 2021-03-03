import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { BoardService } from '../../../board/services/board.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list-board.component.html'
})

export class ListBoardComponent implements OnInit {
    productTypes: any= [];
    boards: any = [];
    currentUser: any= {};
    productType: any= {};
    form: any= {};
    client: any= {};
    alias: any= {};
    board: any= {};
    boardDetails: any= [];
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
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private boardManufacturerService: BoardManufacturerService,
                private boardService: BoardService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST_BOARD, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadBoards();
        this.loadClient();
    }

    loadBoards() {
        this.loading = true;
        $('body').addClass('loading');
        this.boardManufacturerService.getAllBoards(this.currentPage, this.pageSize, this.query)
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
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST_BOARD]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadBoards();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadBoards();
    }


    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == BOARD_MANUFACTURER_CONSTANTS.FIELD.BOARD_ID) {
                form.form.controls[BOARD_MANUFACTURER_CONSTANTS.FIELD.BOARD_ID_FIELD].setErrors({'duplicate': true});
            }
        }
    }

    searchBoard(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadBoards();
        } else {
            this.query = '';
            this.loadBoards();
        }
    }

    changeStatus(board, status) {
        board.active = status;
        this.boardService.updateBoard(board)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST_BOARD]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST_BOARD]);
            this.loading = false;
        });
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
