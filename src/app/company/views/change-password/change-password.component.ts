import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { COMPANY_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { CompanyService } from '../../services/company.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    company: any= {};
    alias: any= {};
    companyType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    client: any= {};
    currentUser=undefined;
    companyObj: any= {};
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    COMPANY_VALIDATOR= COMPANY_VALIDATOR;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_PASSWORD,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_CHANGE_PASSWORD,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_CREATE;
    backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
    formValidation= {
    duplicateErrorName: false,
    duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private companyService : CompanyService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_VALIDATOR = COMPANY_VALIDATOR;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompany();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.adminForm = this.createCompanyForm();
        this.passwordUser = {};
        this.loadClient();
    }

    createCompanyForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.company && this.company.admin ? this.company.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateCompany() {
        var companyObj = this.adminForm.value;
        $('body').addClass('loading');
        companyObj.username = this.company.admin.username;
        this.companyService.updatePassword(companyObj, this.company.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }else {
                this.sweetAlertService.updateConfirmation(this.client.companyNickName + ' ' + 'Password');
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    loadCompany() {
        this.companyService.getCompany(this.alias)
        .subscribe(
        data => {
            this.company = data['data'][0];
            this.adminForm = this.createCompanyForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    validateForm() {
        let valid = true;
        if (!this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(COMPANY_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateCompany();
    }

    list() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
           this.breadCrumService.pushStep(COMPANY_CONSTANTS.LABEL.COMPANY_CHANGE_PASSWORD_LINK, COMPANY_CONSTANTS.URL.COMPANY_CHANGE_PASSWORD, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

}
