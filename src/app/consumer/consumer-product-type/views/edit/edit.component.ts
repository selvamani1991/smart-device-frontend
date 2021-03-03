import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { CONSUMER_PRODUCT_TYPE_VALIDATOR } from '../../validator';
import { ATTRIBUTE_VALIDATOR } from '../../validator';

import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import {ConsumerProductTypeService } from '../../services/consumer-product-type.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    consumerProductType: any= {};
    consumerProductTypeForm: FormGroup;
    attributeForm: FormGroup;
    attribute: any= {};
    attributeTypes= [];
    consumerProductTypes: any= [];
    valueTypes: any= [];
    selectedValueTypes= [];
    attributes= [];
    paginationItems= [];
    itemSize= 0;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_VALIDATOR= CONSUMER_PRODUCT_TYPE_VALIDATOR;
    ATTRIBUTE_VALIDATOR= ATTRIBUTE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE,
        pageTitle: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_EDIT,
        pageDesc: CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_EDIT_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_ACTION_EDIT;
    backUrl= CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorConsumerProductTypename: false,
        duplicateErrorEmail: false
    };
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
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_VALIDATOR = CONSUMER_PRODUCT_TYPE_VALIDATOR;
        this.ATTRIBUTE_VALIDATOR = ATTRIBUTE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_LIST_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST, true);
        breadCrumService.pushStep(CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE_EDIT_LINK, CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_TYPE_CONSTANTS.LABEL.CONSUMER_PRODUCT_TYPE);

        this.valueTypes = [
            {'id': 'string', 'name': 'String'},
            {'id': 'float', 'name': 'Float'},
            {'id': 'integer', 'name': 'Integer'}
        ];

        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadConsumerProductType(this.alias);
        });
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
             id                                 : [this.consumerProductType.id],
             ownerId                            : [this.consumerProductType.ownerId],
             alias                              : [this.consumerProductType.alias],
             logo                               : [this.consumerProductType.logo],
             name                               : [this.consumerProductType.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
             description                        : [this.consumerProductType.description, [Validators.required, Validators.minLength(3)]],
             productInstruction                 : [this.consumerProductType.productInstruction, [Validators.required, Validators.minLength(3)]],
             attributes                         : this._formBuilder.array([]),
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
        for (var  i = 0; i < (this.consumerProductTypeForm.get('attributes') as FormArray).length ; i++ ) {
        let index = i;
            if (!_self.selectedValueTypes[index]) {
                _self.selectedValueTypes[index] = 'string';
            }
            $('#selectValueType' + i).select2({
                width: '100%'
            });
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

    loadConsumerProductType(alias) {
        this.consumerProductTypeService.getConsumerProductType(alias)
        .subscribe(
        data => {
            this.consumerProductType = data['data'][0];
            this.consumerProductTypeForm = this.createConsumerProductTypeForm();
             for (let i = 0; i < this.consumerProductType.attributes.length; i++) {
             let index = i;
                    (this.consumerProductTypeForm.get('attributes') as FormArray).push(this.buildAttribute(this.consumerProductType.attributes[i]));
                    this.selectedValueTypes[index] = this.consumerProductType.attributes[i].valueType;
             }
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.router.navigate([CONSUMER_PRODUCT_TYPE_CONSTANTS.URL.CONSUMER_PRODUCT_TYPE_LIST]);
           this.loading = false;
        });
    }

    updateConsumerProductType() {
        this.consumerProductType = this.consumerProductTypeForm.value;
        $('body').addClass('loading');
        this.loading = true;
        for (let i = 0; i < this.consumerProductType.attributes.length; i++) {
            this.consumerProductType.attributes[i].valueType = this.selectedValueTypes[i];
        }
        this.consumerProductTypeService.updateConsumerProductType(this.consumerProductType)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
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

}
