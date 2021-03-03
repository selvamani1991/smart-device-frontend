import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ROOM_TYPE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { RoomTypeService } from '../../services/room-type.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    roomTypes: any = [];
    form: any= {};
    roomType: any= {};
    currentUser=undefined;
    roomTypeDetails: any= [];
    services= [];
    loading = false;
    ROOM_TYPE_CONSTANTS= ROOM_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE,
        pageTitle: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_LIST,
        pageDesc: ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private roomTypeService: RoomTypeService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ROOM_TYPE_CONSTANTS = ROOM_TYPE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE_LIST_LINK, ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ROOM_TYPE_CONSTANTS.LABEL.ROOM_TYPE);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
       this.loadRoomType();
    }

    loadRoomType() {
        this.loading = true;
        $('body').addClass('loading');
        this.roomTypeService.getAllRoomTypes(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.roomTypes = data['data'];
                this.paginationItems = this.roomTypes;
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
                this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadRoomType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadRoomType();
    }

    addRoomType() {
        this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_CREATE]);
    }

    edit(roomType) {
        this.tooltipService.clear();
        this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_EDIT, roomType.alias]);
    }

    show(roomType) {
        this.tooltipService.clear();
        this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_SHOW, roomType.alias]);
    }

    markDeleted(roomType) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, roomType);
    }

    remove(roomType) {
        this.roomTypeService.deleteRoomType(roomType.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                roomType.isDeleted = true;
                roomType.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
                this.loadRoomType();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changeStatus(roomType, status) {
        roomType.active = status;
        this.roomTypeService.updateRoomType(roomType)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ROOM_TYPE_CONSTANTS.URL.ROOM_TYPE_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) { 
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == ROOM_TYPE_CONSTANTS.FIELD.NAME) {
                form.form.controls[ROOM_TYPE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchRoomType(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadRoomType();
        }else {
           this.query = '';
           this.loadRoomType();
        }
    }
}
