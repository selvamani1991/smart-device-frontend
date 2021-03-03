import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ProductService} from '../../services/product.service';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    product: any= {};
    products= [];
    client: any= {};
    files= [];
    user: any= {};
    users= [];
    services= [];
    currentUser= undefined;
    manufacturerDate: any;
    productForm: FormGroup;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
      entity:  PRODUCT_CONSTANTS.LABEL.PRODUCT_IMAGE,
      pageTitle: PRODUCT_CONSTANTS.LABEL.PRODUCT_SHOW,
      pageDesc: PRODUCT_CONSTANTS.LABEL.PRODUCT_SHOW_DESC
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
                private productService: ProductService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProduct(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.createProductForm();
        this.loadClient();
    }

    createProductForm(): FormGroup {
        var manufacturerDate = this.dateService.getDateString(this.product.manufacturerDate);
        return this.productForm = this._formBuilder.group({
            id                  : [this.product.id],
            name                : [this.product.name, []],
            description         : [this.product.description, []],
            manufacturerDate    : [manufacturerDate],
            imieId              : [this.product.imieId, []],
            deviceId            : [this.product.deviceId, []],
            url                 : [this.product.url, []],
        });
    }

    loadProduct(alias) {
        $('body').addClass('loading');
        this.productService.getProduct(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.product = data['data'][0];
            this.productForm = this.createProductForm();
            this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.product.productType.alias),true);
            this.breadCrumService.pushStep('Show' + ' ' +   this.client.productNickName, PRODUCT_CONSTANTS.URL.PRODUCT_SHOW, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadProduct(this.alias);
        },
        error =>{
            this.loading = false;
        });
    }

    processFile() {
         $('body').addClass('loading');
         this.productService.uploadImage(this.files, this.product.id)
         .subscribe(
         data => {
             $('body').removeClass('loading');
             this.product = data['data'][0];
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

    print() {
        $('#qrModal').modal('show');

    }

    markDeleted(product) {
        this.sweetAlertService.deleteCheck(this, product);
    }

    remove() {
        this.product.logo=null;
        this.productService.deleteProfilePicture(this.product)
        .subscribe(
        data => {
            if (!data['hasError']) {
               this.sweetAlertService.deleteImage(this.setting.entity);
               this.loadProduct(this.alias);
            }
        },
        error => {
           this.loading = false;
        });
    }
}
