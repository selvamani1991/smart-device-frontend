import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CONSUMER_PRODUCT_CONSTANTS } from '../../constants';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../../consumer-product-type/constants';

import { CONSUMER_PRODUCT_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';

import { DateService } from '../../../../shared/services/date.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

import { ConsumerProductService } from '../../services/consumer-product.service';
import { ConsumerProductTypeService } from '../../../consumer-product-type/services/consumer-product-type.service';


import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    consumerProduct: any= {};
    consumerProductType: any= {};
    alias: any= {};
    consumerProductObj: any= {};
    manufacturingDate: any;
    consumerProducts: any= [];
    consumerProductForm: FormGroup;
    CONSUMER_PRODUCT_CONSTANTS= CONSUMER_PRODUCT_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    CONSUMER_PRODUCT_VALIDATOR= CONSUMER_PRODUCT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT,
        pageTitle: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_CREATE,
        pageDesc: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_CREATE_DESC
    };
    steps= [];
    buttonName= CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_ACTION_CREATE;
    backUrl= CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST;
    formValidation= {
        duplicateErrorConsumerProductname: false,
    };

    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private consumerProductService: ConsumerProductService,
                private consumerProductTypeService: ConsumerProductTypeService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_PRODUCT_CONSTANTS = CONSUMER_PRODUCT_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_PRODUCT_VALIDATOR = CONSUMER_PRODUCT_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.consumerProductForm = this.createConsumerProductForm();
        this.loadConsumerProductType();
        $('#manufacturingDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.manufacturingDate = selectedDate;
                this.consumerProductForm.get('manufacturingDate').setErrors(null);

            }
        });
    }

    createConsumerProductForm(): FormGroup {
        return this.consumerProductForm = this._formBuilder.group({
            id                    : [this.consumerProduct.id],
            name                  : [this.consumerProduct.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description           : [this.consumerProduct.description, [Validators.required, Validators.minLength(3)]],
            deviceId              : [this.consumerProduct.deviceId, [Validators.required, Validators.minLength(2)]],
            //imieId                : [this.consumerProduct.imieId, [Validators.required, Validators.minLength(2)]],
            //modelNo               : [this.consumerProduct.modelNo, [Validators.required, Validators.minLength(2)]],
            //lotNo                 : [this.consumerProduct.lotNo, [Validators.required, Validators.minLength(2)]],
            //manufacturingDate     : [this.consumerProduct.manufacturingDate,[Validators.required]]
        });
    }

    createConsumerProduct() {
        this.consumerProduct = this.consumerProductForm.value;
        $('body').addClass('loading');
        //this.consumerProduct.manufacturingDate = this.dateService.getLongFromString(this.manufacturingDate);
        this.consumerProduct.consumerProductType = this.consumerProductType;
        this.consumerProductService.saveConsumerProduct(this.consumerProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.consumerProductType.alias]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.consumerProductType.alias]);
            this.loading = false;
        });
    }

    loadConsumerProductType() {
        this.consumerProductTypeService.getConsumerProductType(this.alias)
        .subscribe(
        data => {
            this.consumerProductType = data['data'][0];
            this.breadCrumService.pushStep(CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_LIST_LINK, CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST_ALIAS.replace(":alias",this.consumerProductType.alias),true);
            this.breadCrumService.pushStep(CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_EDIT_LINK, CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST]);
            this.loading = false;
        });

    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CONSUMER_PRODUCT_CONSTANTS.FIELD.NAME) {
                this.consumerProductForm.get('name').setErrors({'duplicate': true});
            }
            if (data.error.errorField == CONSUMER_PRODUCT_CONSTANTS.FIELD.DEVICEID) {
                this.consumerProductForm.get('deviceId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == CONSUMER_PRODUCT_CONSTANTS.FIELD.IMIEID) {
                this.consumerProductForm.get('imieId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == CONSUMER_PRODUCT_CONSTANTS.FIELD.LOTNO) {
                this.consumerProductForm.get('lotNo').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST, this.consumerProductType.alias]);
    }
}
