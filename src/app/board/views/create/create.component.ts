import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { BOARD_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { BoardService } from '../../services/board.service';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    currentUser= undefined;
    board: any= {};
    alias: any= {};
    orderId: any= '';
    productType: any= {};
    boardProductType: any= {};
    boardProductTypeId: any= {};
    form: any= {};
    manufacturerDate: any;
    boardForm: FormGroup;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    BOARD_VALIDATOR= BOARD_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_CONSTANTS.LABEL.BOARD,
        pageTitle: BOARD_CONSTANTS.LABEL.BOARD_CREATE,
        pageDesc: BOARD_CONSTANTS.LABEL.BOARD_CREATE_DESC
    };
    steps= [];
    buttonName= BOARD_CONSTANTS.LABEL.BOARD_ACTION_CREATE;
    backUrl= BOARD_CONSTANTS.URL.BOARD_BOARD_LIST;
    formValidation= {
        duplicateErrorBoardname: false,
        duplicateErrorEmail: false,
        duplicateErrorBoardId: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private boardService: BoardService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.BOARD_VALIDATOR = BOARD_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_CONSTANTS.LABEL.BOARD);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();

            }
        );
    }

    ngOnInit() {
        this.boardForm = this.createBoardForm();
        this.loadBoardProductType();
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
        return this.boardForm = this._formBuilder.group({
            id                    : [this.board.id],
            name                  : [this.boardProductType ? this.boardProductType.orderId : ''],
            description           : [this.board.description, [Validators.required, Validators.minLength(3)]],
            boardId               : [this.board.boardId, [Validators.required,Validators.minLength(2), Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            imieId                : [this.board.imieId, [Validators.required,Validators.pattern(/^\d{2,}$/)]],
            deviceId              : [this.board.deviceId, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            manufacturerDate      : [this.board.manufacturerDate, [Validators.required]]

        });
    }

    createBoard(form) {
        this.board = this.boardForm.value;
        if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
            this.board.createdByAdmin = true;
        } else {
            this.board.createdByAdmin = false;
        }

        $('body').addClass('loading');
        this.board.productType = this.boardProductType.productType;
        this.board.boardProductTypeId = this.boardProductType.alias;
        this.board.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.boardService.saveBoard(this.board)
        .subscribe(
        data => {
        $('body').removeClass('loading');
            if (data['hasError']) {
                 this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                    this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, this.boardProductType.alias]);
                } else {
                    this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.boardProductType.alias]);
                }
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.boardProductType.alias]);
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
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS, this.alias]);
        } else {
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD, this.alias]);
        }
    }

    loadBoardProductType() {
         this.boardService.getBoardProductType(this.alias)
         .subscribe(
         data => {
             this.boardProductType = data['data'][0];
             this.boardForm = this.createBoardForm();
             if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                 this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_BOARDS_ALIAS.replace(":alias",this.boardProductType.alias),true);
                 this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_CREATE_LINK, BOARD_CONSTANTS.URL.BOARD_CREATE, false);
                 this.steps = this.breadCrumService.getSteps();
             }
             if (this.currentUser && this.currentUser.userType == 'boardManufacturerAdmin') {
                 this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD_ALIAS.replace(":alias",this.boardProductType.alias),true);
                 this.breadCrumService.pushStep(BOARD_CONSTANTS.LABEL.BOARD_CREATE_LINK, BOARD_CONSTANTS.URL.BOARD_CREATE, false);
                 this.steps = this.breadCrumService.getSteps();

             }
         },
         failure => {
             this.httpResponseService.showErrorResponse(failure);
             this.loading = false;
         });
    }
}
