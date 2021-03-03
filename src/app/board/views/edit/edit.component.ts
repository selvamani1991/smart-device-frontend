import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup,Validators } from '@angular/forms';
import { Title }     from '@angular/platform-browser';
import { BOARD_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { BOARD_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BoardService } from '../../services/board.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    currentUser= undefined;
    board: any= {};
    boardProductType: any= {};
    boardProductTypeId: any= {};
    boardForm: FormGroup;
    manufacturerDate: any;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    BOARD_VALIDATOR= BOARD_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_CONSTANTS.LABEL.BOARD,
        pageTitle: BOARD_CONSTANTS.LABEL.BOARD_EDIT,
        pageDesc: BOARD_CONSTANTS.LABEL.BOARD_EDIT_DESC
    };
    steps= [];
    buttonName= BOARD_CONSTANTS.LABEL.BOARD_ACTION_EDIT;
    backUrl= BOARD_CONSTANTS.URL.BOARD_BOARD_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorBoardname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private boardService: BoardService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.BOARD_VALIDATOR = BOARD_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_CONSTANTS.LABEL.BOARD);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadBoard(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.boardForm = this.createBoardForm();
        $('#manufacturerDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.manufacturerDate = selectedDate;
                 this.boardForm.get('manufacturerDate').setErrors(null);
             }
        });
    }

    createBoardForm(): FormGroup {
        this.board.manufacturerDate = this.dateService.getDateString(this.board.manufacturerDate);
        return this.boardForm = this._formBuilder.group({
            id                    : [this.board.id],
            alias                 : [this.board.alias],
            ownerId               : [this.board.ownerId],
            description           : [this.board.description, [Validators.required, Validators.minLength(3)]],
            boardId               : [this.board.boardId, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            imieId                : [this.board.imieId, [Validators.required, Validators.pattern(/^\d{2,}$/)]],
            manufacturerDate      : [this.board.manufacturerDate,[Validators.required]],
            deviceId              : [this.board.deviceId, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
        });
    }

    updateBoard() {
        var boardObj = this.boardForm.value;
        $('body').addClass('loading');
        this.board.description = boardObj.description;
        this.board.boardId = boardObj.boardId;
        this.board.imieId = boardObj.imieId;
        this.board.deviceId = boardObj.deviceId;
        this.board.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.board.id = this.board.id;
        this.boardService.updateBoard(this.board)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                    this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, this.board.boardProductTypeId]);
                } else {
                    this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.board.boardProductTypeId]);
                }
            }
            this.loading = false;
        },

        failure => {
            this.httpResponseService.showErrorResponse(failure);
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, this.board.boardProductTypeId]);
            } else {
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.board.boardProductTypeId]);
            }
            this.loading = false;
        });

    }

    loadBoard(alias) {
        this.boardService.getBoard(alias)
        .subscribe(
        data => {
            this.board = data['data'][0];
            this.boardForm = this.createBoardForm();
            this.manufacturerDate = this.board.manufacturerDate;
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
               this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS_ALIAS.replace(":alias",this.board.boardProductTypeId),true);
            } else {
               this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD_ALIAS.replace(":alias",this.board.boardProductTypeId),true);
            }
            this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_EDIT_LINK, BOARD_CONSTANTS.URL.BOARD_EDIT, false);
            this.steps = this.breadCrumService.getSteps();


        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.alias]);
            this.loading = false;
        });

    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == BOARD_CONSTANTS.FIELD.BOARDID) {
                this.boardForm.get('boardId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == BOARD_CONSTANTS.FIELD.BOARDID_DUPLICATE) {
                this.boardForm.get('boardId').setErrors({'duplicate': true});
            }

            if (data.error.errorField == BOARD_CONSTANTS.FIELD.IMIEID) {
                this.boardForm.get('imieId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == BOARD_CONSTANTS.FIELD.IMIEID_DUPLICATE) {
                this.boardForm.get('imieId').setErrors({'duplicate': true});
            }

            if (data.error.errorField == BOARD_CONSTANTS.FIELD.DEVICEID) {
                this.boardForm.get('deviceId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == BOARD_CONSTANTS.FIELD.DEVICEID_DUPLICATE) {
                this.boardForm.get('deviceId').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, this.board.boardProductTypeId]);
        } else {
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.board.boardProductTypeId]);
        }
    }
}
