import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CATEGORY_CONSTANTS } from '../../constants';
import { PRODUCT_CATEGORY_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ProductCategoryService } from '../../services/product-category.service';
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
    productCategory: any= {};
    productCategorys: any= [];
    productCategoryForm: FormGroup;
    PRODUCT_CATEGORY_CONSTANTS= PRODUCT_CATEGORY_CONSTANTS;
    PRODUCT_CATEGORY_VALIDATOR= PRODUCT_CATEGORY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    setting = {
        entity: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY,
        pageTitle: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_EDIT,
        pageDesc: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_EDIT_DESC
    };
    steps= [];
    buttonName= PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_ACTION_EDIT;
    backUrl= PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorProductCategoryname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_CATEGORY_CONSTANTS = PRODUCT_CATEGORY_CONSTANTS;
        this.PRODUCT_CATEGORY_VALIDATOR = PRODUCT_CATEGORY_VALIDATOR;
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST, true);
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_EDIT_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductCategory(this.alias);
        });
    }

    ngOnInit() {
        this.productCategoryForm = this.createProductCategoryForm();

    }

    createProductCategoryForm(): FormGroup {
        return this.productCategoryForm = this._formBuilder.group({
            id                    : [this.productCategory.id],
            ownerId               : [this.productCategory.ownerId],
            alias                 : [this.productCategory.alias],
            logo                  : [this.productCategory.logo],
            name                  : [this.productCategory.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.productCategory.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            consumerProductSupported     : [this.productCategory.consumerProductSupported]

        });

    }

    loadProductCategory(alias) {
        this.productCategoryService.getProductCategory(alias)
        .subscribe(
        data => {
            this.productCategory = data['data'][0];
            this.productCategoryForm = this.createProductCategoryForm();

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    updateProductCategory() {
        this.productCategory = this.productCategoryForm.value;
        $('body').addClass('loading');
        this.productCategoryService.updateProductCategory(this.productCategory)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            this.loading = false;
        });
    }

    list() {
        this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
    }
}
