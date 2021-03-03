import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { CompanyBuildingService } from '../../services/company-building.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    companyBuilding: any= {};
    form: any= {};
    alias: any= {};
    companyBuildingType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    client: any= {};
    currentUser=undefined;
    companyBuildingObj: any= {};
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    COMPANY_BUILDING_VALIDATOR= COMPANY_BUILDING_VALIDATOR;
    setting = {
        entity: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_PASSWORD,
        pageTitle: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_CHANGE_PASSWORD,
        pageDesc: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_ACTION_CREATE;
    backUrl= COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST;
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
                private companyBuildingService: CompanyBuildingService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.COMPANY_BUILDING_VALIDATOR = COMPANY_BUILDING_VALIDATOR;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompanyBuilding();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.adminForm = this.createCompanyBuildingForm();
        this.passwordUser = {};
        this.loadClient();
    }

    createCompanyBuildingForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.companyBuilding && this.companyBuilding.admin ? this.companyBuilding.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateCompanyBuilding(){
        let companyBuildingObj = this.adminForm.value;
        $('body').addClass('loading');
        companyBuildingObj.username = this.companyBuilding.admin.username;
        this.companyBuildingService.updatePassword(companyBuildingObj, this.companyBuilding.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });
    }

    loadCompanyBuilding(){
        this.companyBuildingService.getCompanyBuilding(this.alias)
        .subscribe(
        data => {
            this.companyBuilding = data['data'][0];
            this.adminForm = this.createCompanyBuildingForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });
    }


    validateForm() {
        let valid = true;
        if (!this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(COMPANY_BUILDING_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateCompanyBuilding();
    }

    list() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyBuildingNickName + ' ' + 'List', COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST, true);
           this.breadCrumService.pushStep(COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_CHANGE_PASSWORD_LINK, COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_CHANGE_PASSWORD, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }
}
