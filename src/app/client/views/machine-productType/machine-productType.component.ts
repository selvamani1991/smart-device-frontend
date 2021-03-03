import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { MACHINE_CONSTANTS } from '../../../machine/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientProductService } from '../../services/client-product.service';
import { ClientService } from '../../services/client.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'machine-productType.component.html'
})

export class MachineProductTypeComponent implements OnInit {
    clients: any = [];
    users= [];
    client: any= {};
    productType: any= {};
    currentUser=undefined;
    form: any= {};
    clientDetails: any= [];
    machineProductTypes: any= [];
    services= [];
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.MACHINE_PRODUCT_TYPE,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_LIST,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private clientProductService: ClientProductService,
                private clientService: ClientService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        this.loadMachineProductType();
        this.loadClient();
    }

    loadMachineProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientProductService.getAllMachineProductTypes(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.machineProductTypes = data['data'];
            this.paginationItems = this.machineProductTypes;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.machineProductTypes.length; i++){
                if (this.machineProductTypes[i].assignedDate && this.machineProductTypes[i].assignedDate > 0 ){
                    this.machineProductTypes[i].assignedDate = this.dateService.getDateString(this.machineProductTypes[i].assignedDate);
                }else{
                    this.machineProductTypes[i].assignedDate = 'N/A';
                }
            }

        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
            this.loading = false;
        });

    }
    
    acceptProductType(machineProductType) {
        machineProductType.status = 'Accepted';
        this.clientProductService.updateMachineProductType(machineProductType)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CLIENT_CONSTANTS.FIELD.NAME) {
                form.form.controls[CLIENT_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    changePage(event) {
        this.currentPage = event;
        this.loadMachineProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadMachineProductType();
    }

    show(machineProductType) {
        this.tooltipService.clear();
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE_SHOW, machineProductType.alias]);
    }

    showMachine(machineProductType) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, machineProductType.alias]);
    }

    searchMachineProductType(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadMachineProductType();
        }else {
            this.query = '';
            this.loadMachineProductType();
        }
    }

    changeStatus(machineProductType, status) {
        machineProductType.active = status;
        machineProductType.assignedDate = this.dateService.getLongFromString(machineProductType.assignedDate);
        this.clientProductService.updateMachineProductType(machineProductType)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
                } else {
                    machineProductType.assignedDate = this.dateService.getDateString(machineProductType.assignedDate);
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
                }
                this.loading = false;
            },
            failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
            this.loading = false;
        });
    }

    loadClient() {
        this.clientService.getClients(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Machine' + ' ' + this.client.productTypeNickName, CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
