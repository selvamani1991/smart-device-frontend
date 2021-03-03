import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MachineManufacturerService } from '../../services/machine-manufacturer.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    manufacturers: any = [];
    manufacturer: any= {};
    form: any= {};
    client: any= {};
    currentUser=undefined;
    manufacturerDetails: any= [];
    services= [];
    loading = false;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private machineManufacturerService: MachineManufacturerService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadManufacturers();
        this.loadClient();
    }

    loadManufacturers() {
        this.loading = true;
        $('body').addClass('loading');
        this.machineManufacturerService.getAllManufacturers(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.manufacturers = data['data'];
            this.paginationItems = this.manufacturers;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    changePage(event) {
        this.currentPage = event;
        this.loadManufacturers();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadManufacturers();
    }

    addManufacturer() {
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_CREATE]);
    }

    show(manufacturer) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_SHOW, manufacturer.alias]);
    }

    markDeleted(manufacturer) {
        this.sweetAlertService.deleteCheck(this, manufacturer);
    }

    reloadList() {
        this.loadManufacturers();
    }

    remove(manufacturer) {
        this.machineManufacturerService.deleteManufacturer(manufacturer.alias)
        .subscribe(
            data => {
                if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                    this.sweetAlertService.deleteConfirmation(this.setting.entity);
                    this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
                    this.loadManufacturers();
                } else {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                }
            },
            error => {
                this.alertService.error(error.message);
                this.loading = false;
            }
        );
    }

    edit(manufacturer) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_EDIT, manufacturer.alias]);
    }

    changeStatus(manufacturer, status) {
        manufacturer.active = status;
        this.machineManufacturerService.updateManufacturer(manufacturer)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === MACHINE_MANUFACTURER_CONSTANTS.FIELD.NAME) {
                form.form.controls[MACHINE_MANUFACTURER_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchManufacturer(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadManufacturers();
        }else {
            this.query = '';
            this.loadManufacturers();
        }
    }

    changePassword(manufacturer) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_CHANGE_PASSWORD, manufacturer.alias]);
    }


    loadClient() {
        this.machineManufacturerService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];

        },
        () => {
           this.loading = false;
        });
    }
}
