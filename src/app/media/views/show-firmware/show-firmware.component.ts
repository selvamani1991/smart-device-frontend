import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MEDIA_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { MediaService} from '../../services/media.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show-firmware.component.html'
})

export class ShowFirmwareComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    media: any= {};
    firmwareForm: FormGroup;
    MEDIA_CONSTANTS= MEDIA_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: MEDIA_CONSTANTS.LABEL.MEDIA_IMAGE,
        pageTitle: MEDIA_CONSTANTS.LABEL.MEDIA_SHOW,
        pageDesc: MEDIA_CONSTANTS.LABEL.MEDIA_SHOW_DESC
    };
    alias: any;
        formValidation= {
        duplicateErrorMedianame: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private mediaService: MediaService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.MEDIA_CONSTANTS = MEDIA_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MEDIA_CONSTANTS.LABEL.MEDIA);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadFirmware();
            }
        );
    }

    ngOnInit() {
        this.firmwareForm = this.createFirmwareForm();
        this.loadFirmware();
    }

    createFirmwareForm(): FormGroup {
        return this.firmwareForm = this._formBuilder.group({
            id              : [this.media.id],
            alias           : [this.media.alias],
            name            : [this.media.name, []],
            description     : [this.media.description]
        });
    }

    loadFirmware() {
        $('body').addClass('loading');
        this.mediaService.getMedia(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.media = data['data'][0];
            this.firmwareForm = this.createFirmwareForm();
            this.breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.FIRMWARE_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST_ALIAS.replace(":alias",this.media.productType.alias),true);
            this.breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.FIRMWARE_SHOW_LINK, MEDIA_CONSTANTS.URL.MEDIA_SHOW, false);
            this.steps = this.breadCrumService.getSteps();

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
            this.loading = false;
        } );

    }

}
