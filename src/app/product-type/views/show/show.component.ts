import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE,ERROR_CODE } from '../../../constants';
import { ProductTypeService} from '../../services/product-type.service';
import { ProductCategoryService} from '../../../product-category/services/product-category.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    productType: any= {};
    client: any= {};
    currentUser=undefined;
    component: any= {};
    componentId: any= 0;
    productTypes= [];
    productCategorys= [];
    attributes= [];
    components= [{attributes: [{}]}];
    files= [];
    componentFiles= [];
    services= [];
    selectedProductCategory= {name: 0};
    productTypeForm: FormGroup;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity:  PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_IMAGE,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_SHOW,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_SHOW_DESC
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
                private productTypeService: ProductTypeService,
                private productCategoryService: ProductCategoryService,
                private _formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductType();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.createProductTypeForm();
        this.loadProductCategory();
        this.loadClient();
    }

    createProductTypeForm(): FormGroup{
    this.selectedProductCategory = this.productType.productCategory ? this.productType.productCategory : {};
        return this.productTypeForm = this._formBuilder.group({
            id                      : [this.productType.id],
            name                    : [this.productType.name, []],
            description             : [this.productType.description, []],
            modelNo                 : [this.productType.modelNo, []],
            productCategory         : [this.productType.productCategory ? this.selectedProductCategory.name : 0],
            code                    : [this.component.code],
            payment                 : [this.component.payment],
            appUrl                  : [this.productType.appUrl],
            apiKey                  : [this.productType.apiKey, []]

        });
    }

    loadProductType() {
        $('body').addClass('loading');
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productType = data['data'][0];
            this.productTypeForm = this.createProductTypeForm();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        $('body').addClass('loading');
        this.productTypeService.uploadImage(this.files, this.productType.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productType = data['data'][0];
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
        this.processFile();
    }

    loadProductCategory() {
        this.productCategoryService.getProductCategory(this.alias)
        .subscribe(
        data => {
            this.productCategorys = data['data'][0];

        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        });
    }

    uploadComponentImage(component) {
        this.productTypeService.uploadComponentImageImage(component.componentFiles, this.productType.id, component.id)
        .subscribe(
        data => {
            this.productType = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
        });
    }

    onFileChangeComponent(event, component) {
        component.componentFiles = event.target.files[0];
        this.uploadComponentImage(component);
    }

    markDeleted(productType) {
        this.sweetAlertService.deleteCheck(this, productType);
    }

    remove(productType) {
        productType.logo=null;
        this.productTypeService.deleteProfilePicture(productType)
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

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName+ ' ' + 'List',PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST,true);
            this.breadCrumService.pushStep('Show' + ' ' +  this.client.productTypeNickName, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_SHOW, false);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }
}


