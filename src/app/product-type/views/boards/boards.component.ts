import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { BOARD_CONSTANTS } from '../../../board/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductTypeService } from '../../services/product-type.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'boards.component.html'
})

export class BoardsComponent implements OnInit {
    productTypes: any= [];
    boardProductTypes: any= [];
    boards: any = [];
    currentUser: any= {};
    productType: any= {};
    boardProductType: any= {};
    form: any= {};
    client: any= {};
    alias: any= {};
    board: any= {};
    services= [];
    loading = false;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_TYPE_CONSTANTS.LABEL.BOARD,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.BOARD_LIST,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.BOARD_LIST_DESC
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
                private productTypeService: ProductTypeService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_BOARDS);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        )
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadBoardProductType();
        });
    }

    ngOnInit() {
        this.loadBoardByBoardProductType();
        this.loadClient();
    }

    loadBoardByBoardProductType() {
        this.loading = true;
         $('body').addClass('loading');
        this.productTypeService.getBoardByBoardProductType(this.currentPage, this.pageSize, this.query, this.alias)
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
            this.tooltipService.enable();
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS]);
                this.loading = false;
            }
        );
    }

    acceptBoard(board) {
        board.status = 'Accepted';
        this.productTypeService.updateBoard(board)
        .subscribe(
        data => {
            if (data['hasError']) {
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.loadBoardByBoardProductType();
                $('#boardHide').hide();

            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadBoardByBoardProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadBoardByBoardProductType();
    }

    searchBoard(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.loadBoardByBoardProductType();
        }else {
            this.query = '';
            this.loadBoardByBoardProductType();
        }
    }

    addBoard() {
        this.router.navigate([BOARD_CONSTANTS.URL.BOARD_CREATE, this.alias]);
    }

    loadBoardProductType() {
        this.productTypeService.getBoardProductType(this.alias)
        .subscribe(
        data => {
              this.boardProductType = data['data'][0];
              this.breadCrumService.pushStep(PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_BOARD, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_BOARD_ALIAS.replace(":alias",this.boardProductType.productType.alias),true);
              this.breadCrumService.pushStep(this.client.productTypeNickName + ' ' + 'Board', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, false);
              this.steps = this.breadCrumService.getSteps();

        },
        failure => {
              this.httpResponseService.showErrorResponse(failure);
              this.loading = false;
        });
    }

    edit(board) {
        this.tooltipService.clear();
        this.router.navigate([BOARD_CONSTANTS.URL.BOARD_EDIT, board.alias]);
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadBoardProductType();
        },
        () => {
            this.loading = false;
        });
    }
}
