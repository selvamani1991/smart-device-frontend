import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MACHINE_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MachineService } from '../../services/machine.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'machine-list.component.html'
})

export class MachineListComponent implements OnInit {
    productTypes: any= [];
    machines: any = [];
    currentUser: any= {};
    form: any= {};
    client: any= {};
    alias: any= {};
    machine: any= {};
    productType: any= {};
    machineProductType: any= {};
    machineDetails: any= [];
    services= [];
    loading = false;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_CONSTANTS.LABEL.MACHINE,
        pageTitle: MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST,
        pageDesc: MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_DESC
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
                private machineService: MachineService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_CONSTANTS.LABEL.MACHINE);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadMachineByMachineProductType();
        this.loadMachineProductType();
        this.loadClient();
    }

    loadMachineByMachineProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.machineService.getMachineByMachineProductType(this.currentPage, this.pageSize, this.query, this.alias)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.machines = data['data'];
                this.paginationItems = this.machines;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                var reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                this.tooltipService.enable();
                for (var i = 0; i < this.machines.length; i++) {
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
                this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadMachineByMachineProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadMachineByMachineProductType();
    }

    addMachine() {
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_CREATE, this.alias]);
    }

    edit(machine) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_EDIT, machine.alias]);
    }

    show(machine) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_SHOW, machine.alias]);
    }

    markDeleted(machine) {
         this.sweetAlertService.deleteCheck(this, machine);
    }

    remove(machine) {
        this.machineService.deleteMachine(machine.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                machine.isDeleted = true;
                machine.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.loadMachineByMachineProductType();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST]);
            this.loading = false;
        });
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
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == MACHINE_CONSTANTS.FIELD.MACHINE_ID) {
              form.form.controls(MACHINE_CONSTANTS.FIELD.MACHINE_ID_FIELD).setErrors({'duplicate': true});
            }
        }
    }

    searchMachine(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.currentPage=1;
           this.loadMachineByMachineProductType();
        } else {
            this.query = '';
            this.loadMachineByMachineProductType();
        }
    }

    assignMachine(machine) {
        machine.status = 'Dispatched';
        machine.changeStatus=true;
        machine.manufacturerDate = this.dateService.getLongFromString(machine.manufacturerDate);
        this.machineService.updateAssignMachine(machine)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                machine.manufacturerDate = this.dateService.getDateString(machine.manufacturerDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
            }
            this.loading = false;
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.loading = false;
        });
   }

   loadMachineProductType() {
       this.machineService.getMachineProductType(this.alias)
       .subscribe(
       data => {
           this.machineProductType = data['data'][0];
       },
       failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.loading = false;
       });
   }

   loadClient() {
       this.machineService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
          this.client = data['data'][0];
          this.breadCrumService.pushStep('Machine' + ' ' + this.client.productTypeNickName + ' ' + 'List', CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE, true);
          this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_LINK, MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, false);
          this.steps = this.breadCrumService.getSteps();
       },
       () => {
          this.loading = false;
       });
   }
}
