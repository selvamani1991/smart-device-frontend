import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { BoardService} from '../../services/board.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    board: any= {};
    services: any= [];
    manufacturerDate: any;
    boardForm: FormGroup;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: BOARD_CONSTANTS.LABEL.BOARD_IMAGE,
        pageTitle: BOARD_CONSTANTS.LABEL.BOARD_SHOW,
        pageDesc: BOARD_CONSTANTS.LABEL.BOARD_SHOW_DESC
    };
    alias: any;
        formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private boardService: BoardService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private alertService: AlertService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_CONSTANTS.LABEL.BOARD);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadBoard();
            }
        );
    }

    ngOnInit() {
        this.boardForm = this.createBoardForm();
    }

    createBoardForm(): FormGroup {
        var manufacturerDate = this.dateService.getDateString(this.board.manufacturerDate);
        return this.boardForm = this._formBuilder.group({
            id               : [this.board.id],
            name             : [this.board.name, []],
            description      : [this.board.description],
            boardId          : [this.board.boardId],
            imieId           : [this.board.imieId],
            manufacturerDate : [manufacturerDate],
            deviceId         : [this.board.deviceId]

        });
    }

    loadBoard() {
        $('body').addClass('loading');
        this.boardService.getBoard(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.board = data['data'][0];
            this.boardForm = this.createBoardForm();
            this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD_ALIAS.replace(":alias",this.board.boardProductTypeId),true);
            this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_EDIT_LINK, BOARD_CONSTANTS.URL.BOARD_SHOW, false);
            this.steps = this.breadCrumService.getSteps();

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_CONSTANTS.URL.BOARD_BOARD_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        $('body').addClass('loading');
        this.boardService.uploadImage(this.files, this.board.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.board = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
           $('body').removeClass('loading');
           this.assignResponseError(error);
        });
    }

    assignResponseError(error){
        if (error.error.error.errorCode == ERROR_CODE.code_25) {
             this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
        }

    }

    onFileChange(event) {
        this.files = event.target.files[0];
        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }

    markDeleted(board) {
        this.sweetAlertService.deleteCheck(this, board);
    }

    remove() {
        this.board.logo=null;
        this.boardService.deleteProfilePicture(this.board)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteImage(this.setting.entity);
                this.loadBoard();
            }
        },
        error => {
           this.alertService.error(error.message);
           this.loading = false;
        });
    }
}
