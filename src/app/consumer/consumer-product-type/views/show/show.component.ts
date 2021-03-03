import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';
import { ConsumerProductTypeService} from '../../services/consumer-product-type.service';

import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    consumerProductType: any= {};
    consumerProductTypeForm: FormGroup;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_IMAGE,
        pageTitle: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_SHOW,
        pageDesc: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_SHOW_DESC
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
    private consumerProductTypeService: ConsumerProductTypeService,
    private _formBuilder: FormBuilder,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private httpResponseService: HttpResponseService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST, true);
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_SHOW_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadConsumerProductType();
            }
         );
    }

    ngOnInit() {
        this.createConsumerProductTypeForm();
    }

    createConsumerProductTypeForm(): FormGroup {
        return this.consumerProductTypeForm = this._formBuilder.group({
                id              : [this.consumerProductType.id],
                name            : [this.consumerProductType.name],
                description     : [this.consumerProductType.description]
         });
    }

    loadConsumerProductType() {
        $('body').addClass('loading');
        this.consumerProductTypeService.getConsumerProductType(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerProductType = data['data'][0];
            this.consumerProductTypeForm = this.createConsumerProductTypeForm();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            this.loading = false;
        });

    }

    processFile() {
        $('body').addClass('loading');
        this.consumerProductTypeService.uploadImage(this.files, this.consumerProductType.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerProductType = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
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

        let pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }


    markDeleted(consumerProductType) {
        this.sweetAlertService.deleteCheck(this, consumerProductType);
    }

    remove(consumerProductType) {
        consumerProductType.logo=null;
        this.consumerProductTypeService.deleteProfilePicture(consumerProductType)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
            }
        },
        error => {
            this.loading = false;
        });
    }
}
