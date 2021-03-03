import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ROOM_TYPE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { RoomTypeService} from '../../services/room-type.service';
import { ProductCategoryService} from '../../../product-category/services/product-category.service';
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
    roomType: any= {};
    roomTypeForm: FormGroup;
    ROOM_TYPE_CONSTANTS= ROOM_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_IMAGE,
        pageTitle: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_SHOW,
        pageDesc: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_SHOW_DESC
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
                private roomTypeService: RoomTypeService,
                private productCategoryService: ProductCategoryService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private alertService: AlertService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.ROOM_TYPE_CONSTANTS = ROOM_TYPE_CONSTANTS;
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_LIST_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST, true);
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_SHOW_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadRoomType();
            }
        );
    }

    ngOnInit() {
        this.roomTypeForm = this.createRoomTypeForm();
    }

    createRoomTypeForm(): FormGroup {
        return this.roomTypeForm = this._formBuilder.group({
                id               : [this.roomType.id],
                name             : [this.roomType.name, []],
                description      : [this.roomType.description],
                alias            : [this.roomType.alias],
                file                  : ['', []]
        });
    }

    loadRoomType() {
        $('body').addClass('loading');
        this.roomTypeService.getRoomType(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.roomType = data['data'][0];
            this.roomTypeForm = this.createRoomTypeForm();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            this.loading = false;
        } );

    }

    processFile() {
        $('body').addClass('loading');
        this.roomTypeService.uploadImage(this.files, this.roomType.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.roomType = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity)
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
        }else {
            this.formatError = false;
        }
        this.processFile();
    }

    markDeleted(roomType) {
        this.sweetAlertService.deleteCheck(this, roomType);
    }

    remove() {
       this.roomType.logo=null;
       this.roomTypeService.deleteProfilePicture(this.roomType)
       .subscribe(
       data => {
           if (!data['hasError']) {
               this.sweetAlertService.deleteImage(this.setting.entity);
           }
       },
       error => {
           this.alertService.error(error.message);
           this.loading = false;
       });
    }

}
