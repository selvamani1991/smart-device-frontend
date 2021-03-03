import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ZONE_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ZoneService} from '../../services/zone.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    zone: any= {};
    services: any= [];
    files: any= [];
    formatError= false;
    zoneForm: FormGroup;
    ZONE_CONSTANTS= ZONE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: ZONE_CONSTANTS.LABEL.ZONE_IMAGES,
        pageTitle: ZONE_CONSTANTS.LABEL.ZONE_SHOW,
        pageDesc: ZONE_CONSTANTS.LABEL.ZONE_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private zoneService: ZoneService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.ZONE_CONSTANTS = ZONE_CONSTANTS;
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_LIST_LINK, ZONE_CONSTANTS.URL.ZONE_LIST, true);
        breadCrumService.pushStep(ZONE_CONSTANTS.LABEL.ZONE_SHOW_LINK, ZONE_CONSTANTS.URL.ZONE_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.ZONE_CONSTANTS.LABEL.ZONE);
        this.route.params.subscribe( params => {
        this.alias = params.alias;
            this.loadZone();
        });
    }

    ngOnInit() {
        this.zoneForm = this.createZoneForm();
    }

    createZoneForm(): FormGroup {
        return this.zoneForm = this._formBuilder.group({
            id                    : [this.zone.id],
            name                  : [this.zone.name, []],
            description           : [this.zone.description, []],
            file                  : ['', []],
        });
    }

    loadZone(){
        $('body').addClass('loading');
        this.zoneService.getZone(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.zone = data['data'][0];
            this.zoneForm = this.createZoneForm();
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([ZONE_CONSTANTS.URL.ZONE_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        this.zoneService.uploadImage(this.files, this.zone.id)
        .subscribe(
        data => {
            if(data['hasError']){
                this.assignResponseError(data);
            }else{
                this.zone = data['data'][0];
                this.sweetAlertService.uploadSuccessfully(this.setting.entity);
            }
        },
        error => {
            $('body').removeClass('loading');
            this.assignResponseError(error);
         });
    }

    assignResponseError(error){
        if (error.error.error.errorCode == ERROR_CODE.code_25) {
              this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
        }

    }

    onFileChange(event) {
        this.files = event.target.files[0];
        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
             this.formatError = true;
            return;
        }else {
            this.formatError = false;
        }
        this.processFile();
    }

    markDeleted(zone) {
       this.sweetAlertService.deleteCheck(this, zone);
    }

    remove(zone) {
        zone.logo=null;
        this.zoneService.deleteProfilePicture(zone)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteImage(this.setting.entity);
            }
        },
        error => {
            this.loading = false;
        });
    }
}
