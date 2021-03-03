import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE, SUCCESS_CODE } from '../../../constants';
import { VendorService } from '../../services/vendor.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
    loading = false;
    vendor: any= {};
    form: any= {};
    alias: any= {};
    client: any= {};
    currentUser=undefined;
    vendorType: any= {};
    adminForm: FormGroup;
    passwordUser: any= {};
    vendorObj: any= {};
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    VENDOR_VALIDATOR= VENDOR_VALIDATOR;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR_PASSWORD,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_CHANGE_PASSWORD,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_CHANGE_PASSWORD_DESC
    };
    steps= [];
    buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_CREATE;
    backUrl= VENDOR_CONSTANTS.URL.VENDOR_LIST;
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
                private vendorService : VendorService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_VALIDATOR = VENDOR_VALIDATOR;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadVendor();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.adminForm = this.createVendorForm();
        this.passwordUser = {};
        this.loadClient();
    }

    createVendorForm(): FormGroup {
        return this.adminForm = this._formBuilder.group({
            id                : [this.vendor && this.vendor.admin ? this.vendor.admin.id : '', []],
            password          : ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword   : ['', [Validators.required, Validators.minLength(3)]]

        });
    }

    updateVendor() {
        var vendorObj = this.adminForm.value;
        $('body').addClass('loading');
        vendorObj.username = this.vendor.admin.username;
        this.vendorService.updatePassword(vendorObj, this.vendor.admin.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }else {
                this.sweetAlertService.updateConfirmation(this.client.vendorNickName + ' ' + 'Password');
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
                this.passwordUser = {};
            }

            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    loadVendor() {
        this.vendorService.getVendor(this.alias)
        .subscribe(
        data => {
            this.vendor = data['data'][0];
            this.adminForm = this.createVendorForm();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    validateForm() {
        let valid = true;
        if (!this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get('confirmPassword').setErrors({'required': true});
            return false;
        }
        if (this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(VENDOR_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    submitForm() {
        this.updateVendor();
    }

    list() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
    }


    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'List', VENDOR_CONSTANTS.URL.VENDOR_LIST, true);
           this.breadCrumService.pushStep(VENDOR_CONSTANTS.LABEL.VENDOR_CHANGE_PASSWORD_LINK, VENDOR_CONSTANTS.URL.VENDOR_CHANGE_PASSWORD, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
