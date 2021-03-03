import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { DISTRIBUTOR_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { DistributorService } from '../../services/distributor.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    distributor: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    currentUser=undefined;
    distributorType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    distributorObj: any= {};
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    DISTRIBUTOR_VALIDATOR= DISTRIBUTOR_VALIDATOR;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_PASSWORD,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_CHANGE_PASSWORD,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_CREATE;
    backUrl= DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST;
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
                private distributorService : DistributorService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.DISTRIBUTOR_VALIDATOR = DISTRIBUTOR_VALIDATOR;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadDistributor();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.adminForm = this.createDistributorForm();
        this.passwordUser = {};
        this.loadClient();
    }

    createDistributorForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.distributor && this.distributor.admin ? this.distributor.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateDistributor() {
        var distributorObj = this.adminForm.value;
        $('body').addClass('loading');
        distributorObj.username = this.distributor.admin.username;
        this.distributorService.updatePassword(distributorObj, this.distributor.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }else {
                this.sweetAlertService.updateConfirmation(this.client.distributorNickName + ' ' + 'Password');
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });
    }

    loadDistributor() {
        this.distributorService.getDistributor(this.alias)
        .subscribe(
        data => {
            this.distributor = data['data'][0];
            this.adminForm = this.createDistributorForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });
    }

    validateForm() {
        let valid = true;
        if (!this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateDistributor();
    }

    list() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
    }


    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.breadCrumService.pushStep(DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_CHANGE_PASSWORD_LINK, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_CHANGE_PASSWORD, false);
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
