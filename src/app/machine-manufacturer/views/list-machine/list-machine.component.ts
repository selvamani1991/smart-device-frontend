import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MachineManufacturerService } from '../../services/machine-manufacturer.service';
import { MachineService } from '../../../machine/services/machine.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list-machine.component.html'
})

export class ListMachineComponent implements OnInit {
    productTypes: any= [];
    machines: any = [];
    currentUser: any= {};
    form: any= {};
    alias: any= {};
    machine: any= {};
    client: any= {};
    productType: any= {};
    machineDetails: any= [];
    services= [];
    loading = false;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MACHINE_LIST,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private machineManufacturerService: MachineManufacturerService,
                private machineService: MachineService,
                private dateService: DateService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_LIST, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST_MACHINE, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadMachines();
        this.loadClient();
    }

    loadMachines() {
        this.loading = true;
        $('body').addClass('loading');
        this.machineManufacturerService.getAllMachines(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.machines = data['data'];
            this.paginationItems = this.machines;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.machines.length; i++) {
                if (this.machines[i].manufacturerDate && this.machines[i].manufacturerDate > 0 ) {
                    this.machines[i].manufacturerDate = this.dateService.getDateString(this.machines[i].manufacturerDate);
                }else {
                    this.machines[i].manufacturerDate = 'N/A';
                }

            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST_MACHINE]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadMachines();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadMachines();
    }

    changeStatus(machine, status) {
        machine.active = status;
        this.machineService.updateMachine(machine)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST_MACHINE]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST_MACHINE]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === MACHINE_MANUFACTURER_CONSTANTS.FIELD.MACHINE_ID) {
               form.form.controls(MACHINE_MANUFACTURER_CONSTANTS.FIELD.MACHINE_ID_FIELD).setErrors({'duplicate': true});
            }
        }
    }

    searchMachine(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
          this.query = myModel;
          this.currentPage=1;
          this.loadMachines();
        } else {
            this.query = '';
            this.loadMachines();
        }
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
