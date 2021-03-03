import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_VALIDATOR } from '../../validator';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { ClientService } from '../../services/client.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    client: any= {};
    form: any= {};
    alias: any= {};
    clientType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    clientObj: any= {};
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT_PASSWORD,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_CHANGE_PASSWORD,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_CREATE;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_LIST;
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
                private clientService : ClientService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_LIST, false);
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_CHANGE_PASSWORD_LINK, CLIENT_CONSTANTS.URL.CLIENT_CHANGE_PASSWORD, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadClient();
        });
    }

    ngOnInit() {
        this.adminForm = this.createClientForm();
        this.passwordUser = {};
    }

    createClientForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.client && this.client.admin ? this.client.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateClient() {
        var clientObj = this.adminForm.value;
        $('body').addClass('loading');
        clientObj.username = this.client.admin.username;
        this.clientService.updatePassword(clientObj, this.client.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.clientService.getClient(this.alias)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.adminForm = this.createClientForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }


    validateForm() {
        let valid = true;
        if (!this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(CLIENT_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateClient();
    }

    list() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
    }
}