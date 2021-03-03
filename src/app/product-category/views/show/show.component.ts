import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CATEGORY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE,ERROR_CODE } from '../../../constants';
import { ProductCategoryService} from '../../services/product-category.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    productCategory: any= {};
    services: any= [];
    files: any= [];
    formatError= false;
    selectedDuration= {id: 0};
    duration: any= {id: 0};
    durations = [];
    selectedElapsedPeriod= {id: 0};
    elapsedPeriod: any= {id: 0};
    elapsedPeriods = [];
    productCategoryForm: FormGroup;
    PRODUCT_CATEGORY_CONSTANTS= PRODUCT_CATEGORY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_IMAGES,
        pageTitle: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_SHOW,
        pageDesc: PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_SHOW_DESC
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
                private productCategoryService: ProductCategoryService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.PRODUCT_CATEGORY_CONSTANTS = PRODUCT_CATEGORY_CONSTANTS;
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_LIST_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST, true);
        breadCrumService.pushStep(PRODUCT_CATEGORY_CONSTANTS.LABEL.PRODUCT_CATEGORY_SHOW_LINK, PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_SHOW, false);
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
            name                  : [this.productCategory.name, []],
            description           : [this.productCategory.description, []],
            consumerProductSupported     : [this.productCategory.consumerProductSupported]
        });
    }

    loadProductCategory(alias) {
        $('body').addClass('loading');
        this.productCategoryService.getProductCategory(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productCategory = data['data'][0];
            this.productCategoryForm = this.createProductCategoryForm();
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_CATEGORY_CONSTANTS.URL.PRODUCT_CATEGORY_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        this.productCategoryService.uploadImage(this.files, this.productCategory.id)
        .subscribe(
        data => {
            this.productCategory = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
         error => {
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

    markDeleted(productCategory) {
        this.sweetAlertService.deleteCheck(this, productCategory);
    }

    remove(productCategory) {
        productCategory.logo=null;
        this.productCategoryService.deleteProfilePicture(productCategory)
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
