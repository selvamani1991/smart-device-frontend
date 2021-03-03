import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MACHINE_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { MACHINE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { MachineService } from '../../services/machine.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    currentUser= undefined;
    machine: any= {};
    productType: any= {};
    machineProductType: any= {};
    machines= [];
    manufacturerDate: any;
    machineForm: FormGroup;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS=PRODUCT_TYPE_CONSTANTS;
    MACHINE_VALIDATOR= MACHINE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_CONSTANTS.LABEL.MACHINE,
        pageTitle: MACHINE_CONSTANTS.LABEL.MACHINE_EDIT,
        pageDesc: MACHINE_CONSTANTS.LABEL.MACHINE_EDIT_DESC
    };
    steps= [];
    buttonName= MACHINE_CONSTANTS.LABEL.MACHINE_ACTION_EDIT;
    backUrl= MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorMachinename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private machineService: MachineService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.MACHINE_VALIDATOR = MACHINE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_CONSTANTS.LABEL.MACHINE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadMachine(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.machineForm = this.createMachineForm();
        $('#manufacturerDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.manufacturerDate = selectedDate;
             }
        });
    }

    createMachineForm(): FormGroup {
         this.machine.manufacturerDate = this.dateService.getDateString(this.machine.manufacturerDate);
         return this.machineForm = this._formBuilder.group({
              id                    : [this.machine.id],
              ownerId               : [this.machine.ownerId],
              logo                  : [this.machine.logo],
              alias                 : [this.machine.alias],
              description           : [this.machine.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
              machineId             : [this.machine.machineId, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
              manufacturerDate      : [this.machine.manufacturerDate,[Validators.required]]
         });
    }

    updateMachine() {
        var machineObj = this.machineForm.value;
        $('body').addClass('loading');
        this.machine.description = machineObj.description;
        this.machine.machineId = machineObj.machineId;
        this.machine.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.machineService.updateMachine(this.machine)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                    this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.machine.machineProductTypeId]);
                }else {
                    this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.machine.machineProductTypeId]);
                }

            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.machine.machineProductTypeId]);
            }else {
                this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.machine.machineProductTypeId]);
            }

            this.loading = false;
        });

    }

    loadMachine(alias) {
        this.machineService.getMachine(alias)
        .subscribe(
        data => {
            this.machine = data['data'][0];
            this.machineForm = this.createMachineForm();
            this.manufacturerDate = this.machine.manufacturerDate;
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES_ALIAS.replace(":alias",this.machine.machineProductTypeId),true);
            }else {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_LINK, MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST_ALIAS.replace(":alias",this.machine.machineProductTypeId),true);
            }

            this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_EDIT_LINK, MACHINE_CONSTANTS.URL.MACHINE_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST]);
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
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES, this.machine.machineProductTypeId]);
        }else {
            this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST, this.machine.machineProductTypeId]);
        }
    }
}
