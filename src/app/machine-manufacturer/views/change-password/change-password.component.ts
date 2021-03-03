import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { MACHINE_MANUFACTURER_VALIDATOR } from '../../validator';

import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { MachineManufacturerService } from '../../services/machine-manufacturer.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    manufacturer: any= {};
    form: any= {};
    alias: any= {};
    manufacturerType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    manufacturerObj: any= {};
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    MACHINE_MANUFACTURER_VALIDATOR= MACHINE_MANUFACTURER_VALIDATOR;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_PASSWORD,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_CHANGE_PASSWORD,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_ACTION_CREATE;
    backUrl= MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST;
    formValidation= {
    duplicateErrorName: false,
    duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private machineManufacturerService : MachineManufacturerService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MACHINE_MANUFACTURER_VALIDATOR = MACHINE_MANUFACTURER_VALIDATOR;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_CHANGE_PASSWORD_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_CHANGE_PASSWORD, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadManufacturer();
        });
    }

    ngOnInit() {
        this.adminForm = this.createManufacturerForm();
        this.passwordUser = {};
    }

    createManufacturerForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.manufacturer && this.manufacturer.admin ? this.manufacturer.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateManufacturer() {
        let manufacturerObj = this.adminForm.value;
        $('body').addClass('loading');
        manufacturerObj.username = this.manufacturer.admin.username;
        this.machineManufacturerService.updatePassword(manufacturerObj, this.manufacturer.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }

    loadManufacturer() {
        this.machineManufacturerService.getManufacturer(this.alias)
        .subscribe(
        data => {
            this.manufacturer = data['data'][0];
            this.adminForm = this.createManufacturerForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }


    validateForm() {
        let valid = true;
        if (!this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(MACHINE_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateManufacturer();
    }

    list() {
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }
}
