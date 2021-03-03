import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { MACHINE_CONSTANTS } from '../../../machine/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ProductTypeService } from '../../services/product-type.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'machines.component.html'
})

export class MachinesComponent implements OnInit {
    machines: any = [];
    currentUser: any= {};
    productType: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    machine: any= {};
    manufacturerDate: any= {};
    machineProductType: any= {};
    services= [];
    loading = false;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_TYPE_CONSTANTS.LABEL.MACHINE,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.MACHINE_LIST,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.MACHINE_LIST_DESC
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
                private productTypeService: ProductTypeService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_MACHINES);
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
        this.loadProductType();
        this.loadClient();
    }

    loadMachineByMachineProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.productTypeService.getMachineByMachineProductType(this.currentPage, this.pageSize, this.query, this.alias)
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
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;

            this.tooltipService.enable();
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
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES]);
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

    searchMachine(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.loadMachineByMachineProductType();
        }else {
            this.query = '';
            this.loadMachineByMachineProductType();
        }
    }

    addMachine() {
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_CREATE, this.alias]);
    }

    loadMachineProductType() {
        this.productTypeService.getMachineProductType(this.alias)
        .subscribe(
        data => {
             this.machineProductType = data['data'][0];
             this.breadCrumService.pushStep(PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_MACHINE, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_MACHINE_ALIAS.replace(":alias",this.machineProductType.productType.alias),true);
             this.breadCrumService.pushStep(this.client.productTypeNickName + ' ' + 'Machine', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, false);
             this.steps = this.breadCrumService.getSteps();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    acceptMachine(machine) {
        machine.status = 'Accepted';
        machine.manufacturerDate = this.dateService.getLongFromString(machine.manufacturerDate);
        this.productTypeService.updateMachine(machine)
        .subscribe(
        data => {
            if (data['hasError']) {
            } else {
                machine.manufacturerDate = this.dateService.getDateString(machine.manufacturerDate);
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.loadMachineByMachineProductType();
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadProductType() {
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    edit(machine) {
        this.tooltipService.clear();
        this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_EDIT, machine.alias]);
    }


    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadMachineProductType();
        },
        () => {
            this.loading = false;
        });
    }
}
