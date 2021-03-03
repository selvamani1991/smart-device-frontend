import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ROOM_TYPE_CONSTANTS } from '../../constants';
import { ROOM_TYPE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { RoomTypeService } from '../../services/room-type.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { LegendSettings } from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    roomType: any= {};
    roomTypes: any= [];
    form: any= {};
    roomTypeForm: FormGroup;
    ROOM_TYPE_CONSTANTS= ROOM_TYPE_CONSTANTS;
    ROOM_TYPE_VALIDATOR= ROOM_TYPE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE,
        pageTitle: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_CREATE,
        pageDesc: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_CREATE_DESC
    };
    steps= [];
        buttonName= ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_ACTION_CREATE;
        backUrl= ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST;
        formValidation= {
        duplicateErrorRoomTypename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private roomTypeService: RoomTypeService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
        private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.ROOM_TYPE_CONSTANTS = ROOM_TYPE_CONSTANTS;
        this.ROOM_TYPE_VALIDATOR = ROOM_TYPE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_LIST_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST, true);
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_CREATE_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE);
    }

    ngOnInit() {
        this.roomTypeForm = this.createRoomTypeForm();

    }

    createRoomTypeForm(): FormGroup {
        return this.roomTypeForm = this._formBuilder.group({
            id                    : [this.roomType.id],
            //ownerId               : [this.roomType.ownerId],
            name                  : [this.roomType.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.roomType.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
        });
    }

    createRoomType() {
        this.roomType = this.roomTypeForm.value;
        $('body').addClass('loading');
        this.roomTypeService.saveRoomType(this.roomType)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                    this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            this.loading = false;
        });
    }

    list() {
        this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == ROOM_TYPE_CONSTANTS.FIELD.NAME) {
                this.roomTypeForm.get('name').setErrors({'duplicate': true});
            }

        }
    }
}
