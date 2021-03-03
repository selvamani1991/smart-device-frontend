import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CATEGORY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { PRODUCT_CATEGORY_VALIDATOR } from '../../validator';
import { ProductCategoryService } from '../../services/product-category.service';
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
    productCategory: any= {};
    productCategorys: any= [];
    productCategoryForm: FormGroup;
    PRODUCT_CATEGORY_CONSTANTS= PRODUCT_CATEGORY_CONSTANTS;
    PRODUCT_CATEGORY_VALIDATOR= PRODUCT_CATEGORY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY,
        pageTitle: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_CREATE,
        pageDesc: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_CREATE_DESC
    };
    steps= [];
    buttonName= PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_ACTION_CREATE;
    backUrl= PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST;
    formValidation= {
    duplicateErrorProductCategoryname: false,
    duplicateErrorEmail: false
    };

    constructor(
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_CATEGORY_CONSTANTS = PRODUCT_CATEGORY_CONSTANTS;
        this.PRODUCT_CATEGORY_VALIDATOR = PRODUCT_CATEGORY_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST, true);
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_CREATE_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY);
    }

    ngOnInit() {
        this.productCategoryForm = this.createProductCategoryForm();

    }

    createProductCategoryForm(): FormGroup {
        return this.productCategoryForm = this._formBuilder.group({
            id                    : [this.productCategory.id],
            name                  : [this.productCategory.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.productCategory.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            consumerProductSupported     : [false]

        });
    }

    createProductCategory() {
        this.productCategory = this.productCategoryForm.value;
        $('body').addClass('loading');
        this.productCategoryService.saveProductCategory(this.productCategory)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            this.loading = false;
        });
    }

    list() {
        this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
    }
}
