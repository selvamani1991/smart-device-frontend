import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ZONE_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ZONE_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ZoneService } from '../../services/zone.service';
import { AdminService } from '../../../shared/services/admin.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    zone: any= {};
    zones: any= [];
    zoneForm: FormGroup;
    adminForm: FormGroup;
    ZONE_CONSTANTS= ZONE_CONSTANTS;
    ZONE_VALIDATOR= ZONE_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ZONE_CONSTANTS.LABEL.ZONE,
        pageTitle: ZONE_CONSTANTS.LABEL.ZONE_CREATE,
        pageDesc: ZONE_CONSTANTS.LABEL.ZONE_CREATE_DESC
    };
    steps= [];
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query: '';
    buttonName= ZONE_CONSTANTS.LABEL.ZONE_ACTION_CREATE;
    backUrl= ZONE_CONSTANTS.URL.ZONE_LIST;
    formValidation= {
        duplicateErrorZonename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private zoneService: ZoneService,
                private adminService: AdminService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.ZONE_CONSTANTS = ZONE_CONSTANTS;
        this.ZONE_VALIDATOR = ZONE_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_LIST_LINK, ZONE_CONSTANTS.URL.ZONE_LIST, true);
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_CREATE_LINK, ZONE_CONSTANTS.URL.ZONE_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.ZONE_CONSTANTS.LABEL.ZONE);
    }

    ngOnInit() {
        this.zoneForm = this.createZoneForm();
    }

    createZoneForm(): FormGroup {
        return this.zoneForm = this._formBuilder.group({
            id                    : [this.zone.id],
            name                  : [this.zone.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.zone.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],

        });
    }

    createZone() {
        this.zone = this.zoneForm.value;
         $('body').addClass('loading');
        this.zoneService.saveZone(this.zone)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            this.loading = false;
        });
    }

    validateForm(f){
        let valid = true;
        if (this.adminForm.get(ZONE_CONSTANTS.FIELD.PASSWORD).value == this.adminForm.get(ZONE_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.adminForm.get(ZONE_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
        }else {
            this.adminForm.get(ZONE_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
            valid = false;
        }
        return valid;
    }

    list() {
        this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.zoneForm.get('name').setErrors({'duplicate': true});
            if (data.error.errorField == ZONE_CONSTANTS.FIELD.EMAIL) {
                this.adminForm.get('email').setErrors({'duplicate': true});
            }
        }
    }

}
