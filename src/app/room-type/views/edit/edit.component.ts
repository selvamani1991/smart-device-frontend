import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ROOM_TYPE_CONSTANTS } from '../../constants';
import { ROOM_TYPE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { RoomTypeService } from '../../services/room-type.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var  $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    roomType: any= {};
    roomTypes= [];
    roomTypeForm: FormGroup;
    ROOM_TYPE_CONSTANTS= ROOM_TYPE_CONSTANTS;
    ROOM_TYPE_VALIDATOR= ROOM_TYPE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE,
        pageTitle: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_EDIT,
        pageDesc: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_EDIT_DESC
    };
    steps= [];
    buttonName= ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_ACTION_EDIT;
    backUrl= ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorRoomTypename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
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
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_EDIT_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadRoomType(this.alias);
        });
    }

    ngOnInit() {
        this.roomTypeForm = this.createRoomTypeForm();
    }

    createRoomTypeForm(): FormGroup {
        return this.roomTypeForm = this._formBuilder.group({
            id                    : [this.roomType.id],
            alias                 : [this.roomType.alias],
            //ownerId               : [this.roomType.ownerId],
            //logo                  : [this.roomType.logo],
            name                  : [this.roomType.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.roomType.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],

        });
    }

    updateRoomType() {
        this.roomType = this.roomTypeForm.value;
        $('body').addClass('loading');
        this.roomTypeService.updateRoomType(this.roomType)
        .subscribe(
        data => {
             $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
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

    loadRoomType(alias) {
        this.roomTypeService.getRoomType(alias)
        .subscribe(
        data => {
            this.roomType = data['data'][0];
            this.roomTypeForm = this.createRoomTypeForm();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            this.loading = false;
        });

    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14){
            if (data.error.errorField == ROOM_TYPE_CONSTANTS.FIELD.NAME) {
                   this.roomTypeForm.get('name').setErrors({'duplicate': true});
            }

        }
    }

    list() {
        this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
    }
}
