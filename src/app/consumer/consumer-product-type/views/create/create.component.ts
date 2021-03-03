import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { CONSUMER_PRODUCT_TYPE_VALIDATOR } from '../../validator';
import { ATTRIBUTE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';

import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

import { ConsumerProductTypeService } from '../../services/consumer-product-type.service';

import { HttpResponseService } from '../../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    consumerProductType: any= {};
    attribute: any= {};
    alias: any= {};
    attributeTypes= [];
    selectedValueTypes= [];
    valueTypes= [];
    attributes= [];
    consumerProductTypeObj: any= {};
    consumerProductTypes: any= [];
    consumerProductTypeForm: FormGroup;
    attributeForm: FormGroup;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_VALIDATOR= CONSUMER_PRODUCT_TYPE_VALIDATOR;
    ATTRIBUTE_VALIDATOR= ATTRIBUTE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE,
        pageTitle: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_CREATE,
        pageDesc: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_CREATE_DESC
    };
    steps= [];
    buttonName= CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_ACTION_CREATE;
    backUrl= CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST;
    formValidation= {
        duplicateErrorConsumerProductTypename: false,
    };

    constructor(
                private router: Router,
                private consumerProductTypeService: ConsumerProductTypeService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_VALIDATOR = CONSUMER_PRODUCT_TYPE_VALIDATOR;
        this.ATTRIBUTE_VALIDATOR = ATTRIBUTE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST, true);
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_CREATE_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE);

        this.valueTypes = [
            {'id': 'string', 'name': 'String'},
            {'id': 'float', 'name': 'Float'},
            {'id': 'integer', 'name': 'Integer'}
        ];
    }

    ngOnInit() {
        let _self = this;
        this.consumerProductTypeForm = this.createConsumerProductTypeForm();
       (this.consumerProductTypeForm.get('attributes') as FormArray).push(this.buildAttribute({}));
         setTimeout(function(){
               _self.loadValueTypeSelect();
         }, 1000);
    }

    createConsumerProductTypeForm(): FormGroup {
        return this.consumerProductTypeForm = this._formBuilder.group({
            id                              : [this.consumerProductType.id],
            name                            : [this.consumerProductType.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description                     : [this.consumerProductType.description, [Validators.required, Validators.minLength(3)]],
            productInstruction              : [this.consumerProductType.productInstruction, [Validators.required, Validators.minLength(3)]],
            attributes                      : this._formBuilder.array([]),
        });
    }

    buildAttribute(attribute) {
        let attributeForm = new FormGroup({
          id: new FormControl(attribute.id),
          name: new FormControl(attribute.name, Validators.required),
          code: new FormControl(attribute.code, Validators.required),
          valueType: new FormControl(attribute.valueType ? attribute.valueType : 'string', Validators.required),
          valueMin: new FormControl(attribute.valueMin, Validators.required),
          valueMax: new FormControl(attribute.valueMax, Validators.required),
          valueDefault: new FormControl(attribute.valueDefault, Validators.required),

        });

        return attributeForm;

    }

    loadValueTypeSelect() {
        let _self = this;
        for (let  i = 0; i < (this.consumerProductTypeForm.get('attributes') as FormArray).length ; i++ ) {
        let index = i;
            if (!_self.selectedValueTypes[index]) {
                _self.selectedValueTypes[index] = 'string';
            }
            $('#selectValueType' + i).select2({
                width: '100%'
            });
            // let index=i;
            $('#selectValueType' + i).on('select2:select', function(e){
               let selectId = e.params.data.id;
               _self.selectedValueTypes[index] = selectId;
            });
        }
    }

    addAttribute() {
        let _self = this;
        (this.consumerProductTypeForm.get('attributes') as FormArray).push(this.buildAttribute({}));
        setTimeout(function(){
        _self.loadValueTypeSelect();
        }, 1000);
    }

    createConsumerProductType() {
        this.consumerProductType = this.consumerProductTypeForm.value;
        $('body').addClass('loading');
        for (let i = 0; i < this.consumerProductType.attributes.length; i++) {
            this.consumerProductType.attributes[i].valueType = this.selectedValueTypes[i];
        }
        this.consumerProductTypeService.saveConsumerProductType(this.consumerProductType)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CONSUMER_PRODUCT_TYPE_CONSTANTS.FIELD.NAME) {
                this.consumerProductTypeForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
    }

    removeAttribute(i) {
        let attributes = this.consumerProductTypeForm.get('attributes') as FormArray;
        if (attributes.length > 1) {
           attributes.removeAt(i);
        }
    }

    validateForm() {
        return true;
    }
}
