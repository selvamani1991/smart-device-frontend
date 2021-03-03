import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule , FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    boardManufacturer: any= {};
    form: any= {};
    alias: any= {};
    boardManufacturerType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    boardManufacturerObj: any= {};
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    BOARD_MANUFACTURER_VALIDATOR= BOARD_MANUFACTURER_VALIDATOR;
    setting = {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_PASSWORD,
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CHANGE_PASSWORD,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_ACTION_CREATE;
    backUrl= BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST;
    formValidation= {
        duplicateErrorName: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private boardManufacturerService: BoardManufacturerService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.BOARD_MANUFACTURER_VALIDATOR = BOARD_MANUFACTURER_VALIDATOR;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CHANGE_PASSWORD_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_CHANGE_PASSWORD, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadBoardManufacturer(this.alias);
        });
    }

    ngOnInit() {
        this.adminForm = this.createBoardManufacturerForm();
        this.passwordUser = {};
    }

    createBoardManufacturerForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.boardManufacturer && this.boardManufacturer.admin ? this.boardManufacturer.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateBoardManufacturer() {
        var boardManufacturerObj = this.adminForm.value;
        $('body').addClass('loading');
        boardManufacturerObj.username = this.boardManufacturer.admin.username;
        this.boardManufacturerService.updatePassword(boardManufacturerObj, this.boardManufacturer.admin.alias)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }

    loadBoardManufacturer(alias) {
        this.boardManufacturerService.getBoardManufacturer(this.alias)
        .subscribe(
        data => {
            this.boardManufacturer = data['data'][0];
            this.adminForm = this.createBoardManufacturerForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }


    validateForm() {
        let valid = true;
        if (!this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }


    submitForm(boardManufacturer, form) {
        this.updateBoardManufacturer();
    }

    list(boardManufacturer) {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }
}
