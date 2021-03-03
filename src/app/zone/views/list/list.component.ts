import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ZONE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ZoneService } from '../../services/zone.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    zones: any = [];
    zone: any= {};
    form: any= {};
    services= [];
    loading = false;
    ZONE_CONSTANTS= ZONE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ZONE_CONSTANTS.LABEL.ZONE,
        pageTitle: ZONE_CONSTANTS.LABEL.ZONE_LIST,
        pageDesc: ZONE_CONSTANTS.LABEL.ZONE_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private zoneService: ZoneService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ZONE_CONSTANTS = ZONE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_LIST_LINK, ZONE_CONSTANTS.URL.ZONE_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.ZONE_CONSTANTS.LABEL.ZONE);

    }

    ngOnInit() {
        this.loadZones();
    }

    loadZones() {
        this.loading = true;
        $('body').addClass('loading');
        this.zoneService.getAllZones(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.zones = data['data'];
            this.paginationItems = this.zones;
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
            this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
           this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadZones();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadZones();
    }

    addZone() {
        this.router.navigate([ZONE_CONSTANTS.URL.ZONE_CREATE]);
    }

    edit(zone) {
        this.tooltipService.clear();
        this.router.navigate([ZONE_CONSTANTS.URL.ZONE_EDIT, zone.alias]);
    }

    show(zone) {
        this.tooltipService.clear();
        this.router.navigate([ZONE_CONSTANTS.URL.ZONE_SHOW, zone.alias]);
    }

    markDeleted(zone) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, zone);
    }

    remove(zone) {
        this.zoneService.deleteZone(zone.alias, this.zone)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                zone.isDeleted = true;
                zone.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
                this.loadZones();
            }
            else{
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    reloadList() {
        this.loadZones();
    }

    changeStatus(zone, status) {
        zone.active = status;
        this.zoneService.updateZone(zone)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == ZONE_CONSTANTS.FIELD.NAME) {
                form.form.controls[ZONE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchZone(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadZones();
        }else {
            this.query = '';
            this.loadZones();
        }
    }
}
