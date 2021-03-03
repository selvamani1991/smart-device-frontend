import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ZONE_CONSTANTS } from '../../constants';
import { ZONE_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ZoneService } from '../../services/zone.service';
import { AdminService } from '../../../shared/services/admin.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
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
        pageTitle: ZONE_CONSTANTS.LABEL.ZONE_EDIT,
        pageDesc: ZONE_CONSTANTS.LABEL.ZONE_EDIT_DESC
    };
    steps= [];
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query: '';
    buttonName= ZONE_CONSTANTS.LABEL.ZONE_ACTION_EDIT;
    backUrl= ZONE_CONSTANTS.URL.ZONE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorZonename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private zoneService: ZoneService,
                private adminService: AdminService,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.ZONE_CONSTANTS = ZONE_CONSTANTS;
        this.ZONE_VALIDATOR = ZONE_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_LIST_LINK, ZONE_CONSTANTS.URL.ZONE_LIST, true);
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_EDIT_LINK, ZONE_CONSTANTS.URL.ZONE_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.ZONE_CONSTANTS.LABEL.ZONE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadZone(this.alias);
        });
    }

    ngOnInit() {
        this.zoneForm = this.createZoneForm();
    }

    createZoneForm(): FormGroup {
        return this.zoneForm = this._formBuilder.group({
            id                    : [this.zone.id],
            alias                 : [this.zone.alias],
            logo                  : [this.zone.logo],
            productCount          : [this.zone.productCount],
            ownerId               : [this.zone.ownerId],
            name                  : [this.zone.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.zone.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],

        });
    }

    updateZone() {
        this.zone = this.zoneForm.value;
        $('body').addClass('loading');
        this.zoneService.updateZone(this.zone)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            this.loading = false;
        });
    }


    loadZone(alias) {
        this.zoneService.getZone(alias)
        .subscribe(
        data => {
            this.zone = data['data'][0];
            this.zoneForm = this.createZoneForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    list() {
        this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.zoneForm.get('name').setErrors({'duplicate': true});
        }
    }

}
