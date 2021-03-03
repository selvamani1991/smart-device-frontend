import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MACHINE_CONSTANTS } from '../../constants';
import {MACHINE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MachineService } from '../../services/machine.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    currentUser= undefined;
    machine: any= {};
    productType: any= {};
    machineProductType: any= {};
    alias: any= {};
    machines: any= [];
    productTypes: any= [];
    manufacturerDate: any={};
    machineForm: FormGroup;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    MACHINE_VALIDATOR= MACHINE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_CONSTANTS.LABEL.MACHINE,
        pageTitle: MACHINE_CONSTANTS.LABEL.MACHINE_CREATE,
        pageDesc: MACHINE_CONSTANTS.LABEL.MACHINE_CREATE_DESC
    };
    steps= [];
    buttonName= MACHINE_CONSTANTS.LABEL.MACHINE_ACTION_CREATE;
    backUrl= MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST;
    formValidation= {
        duplicateErrorMachinename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private machineService: MachineService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.MACHINE_VALIDATOR = MACHINE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_CONSTANTS.LABEL.MACHINE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.machineForm = this.createMachineForm();
        this.loadMachineProductType();
        $('#manufacturerDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.manufacturerDate = selectedDate;
                 this.machineForm.get('manufacturerDate').setErrors(null);
             }
        });
    }

    createMachineForm(): FormGroup {
        return this.machineForm = this._formBuilder.group({
            id                    : [this.machine.id],
            name                  : [this.machineProductType ? this.machineProductType.orderId : ''],
            description           : [this.machine.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            machineId             : [this.machine.machineId, [Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            manufacturerDate      : [this.machine.manufacturerDate, [Validators.required]]
        });
    }


    createMachine() {
        this.machine = this.machineForm.value;
        if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
            this.machine.createdByAdmin = true;
        }else {
            this.machine.createdByAdmin = false;
        }
        $('body').addClass('loading');
        this.machine.productType = this.machineProductType.productType;
        this.machine.machineProductTypeId = this.machineProductType.alias;
        this.machine.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.machineService.saveMachine(this.machine)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                    this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                    this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.machineProductType.alias]);
                }else {
                    this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.machineProductType.alias]);
                }
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.machineProductType.alias]);
            }else {
                this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.machineProductType.alias]);
            }
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.machineForm.get('machineId').setErrors({'duplicate': true});
        }
    }

    list() {
        if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.alias]);
        }else {
            this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.alias]);
        }
    }

    loadMachineProductType() {
        this.machineService.getMachineProductType(this.alias)
        .subscribe(
        data => {
            this.machineProductType = data['data'][0];
            this.machineForm = this.createMachineForm();
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES_ALIAS.replace(":alias",this.machineProductType.alias),true);
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_CREATE_LINK, MACHINE_CONSTANTS.URL.MACHINE_CREATE, false);
                this.steps = this.breadCrumService.getSteps();
            }
            if (this.currentUser && this.currentUser.userType == 'manufacturerAdmin') {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_LIST_LINK, MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST_ALIAS.replace(":alias",this.machineProductType.alias),true);
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_CREATE_LINK, MACHINE_CONSTANTS.URL.MACHINE_CREATE, false);
                this.steps = this.breadCrumService.getSteps();
            }
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

}
