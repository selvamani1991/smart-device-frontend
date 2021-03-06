﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MEDIA_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { FIRMWARE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MediaService } from '../../services/media.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create-firmware.component.html'
})

export class CreateFirmwareComponent implements OnInit {
    loading = false;
    submitted = false;
    media: any= {};
    alias: any= {};
    productType: any= {};
    file: any= {};
    files= undefined;
    mediaTypes: any= [];
    selectedMediaType= '';
    form: any= {};
    firmwareForm: FormGroup;
    MEDIA_CONSTANTS= MEDIA_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    FIRMWARE_VALIDATOR= FIRMWARE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MEDIA_CONSTANTS.LABEL.FIRMWARE,
        pageTitle: MEDIA_CONSTANTS.LABEL.FIRMWARE_CREATE,
        pageDesc: MEDIA_CONSTANTS.LABEL.FIRMWARE_CREATE_DESC
    };
    steps= [];
        buttonName= MEDIA_CONSTANTS.LABEL.MEDIA_ACTION_CREATE;
        backUrl= MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST;
        formValidation= {
        duplicateErrorMedianame: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private mediaService: MediaService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MEDIA_CONSTANTS = MEDIA_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.FIRMWARE_VALIDATOR = FIRMWARE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MEDIA_CONSTANTS.LABEL.MEDIA);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.firmwareForm = this.createMediaForm();
        this.loadProductType();
    }

    createMediaForm(): FormGroup {
        return this.firmwareForm = this._formBuilder.group({
            id                    : [this.media.id],
            name                  : [this.media.name, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.media.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            file                  : [this.file, [Validators.required]]
        });
    }

    createFirmware() {
        this.media = this.firmwareForm.value;
        $('body').addClass('loading');
        this.mediaService.uploadMedia(this.files, this.media.name, this.media.description, 'firmware', this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                    this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST, this.alias]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST, this.alias]);
            this.loading = false;
        });
    }

    onFileChange(event) {
        this.files = event.target.files[0];
        this.firmwareForm.get('file').setErrors(null);
    }

    list() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST, this.alias]);
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == MEDIA_CONSTANTS.FIELD.NAME) {
                this.firmwareForm.get('name').setErrors({'duplicate': true});
            }

        }
        if (data.error.errorCode == ERROR_CODE.code_25) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }

    validateForm() {
        let error = true;
        if (!this.files) {
            this.firmwareForm.get('file').setErrors({'required': true});
            error = false;
        }
        return error;

    }

    loadProductType() {
        this.mediaService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
           this.breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.FIRMWARE_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_FIRMWARE_LIST_ALIAS.replace(":alias",this.productType.alias),true);
           this.breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.FIRMWARE_CREATE, MEDIA_CONSTANTS.URL.MEDIA_SHOW, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }
}
