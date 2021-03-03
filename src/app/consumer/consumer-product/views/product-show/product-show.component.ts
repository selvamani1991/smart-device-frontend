import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CONSUMER_PRODUCT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';
import { ConsumerProductService} from '../../services/consumer-product.service';

import { DateService } from '../../../../shared/services/date.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'product-show.component.html'
})

export class ProductShowComponent implements OnInit {
    loading = false;
    files: any= [];
    consumerProduct: any= {};
    manufacturingDate: any;
    formatError= false;
    consumerProductForm: FormGroup;
    CONSUMER_PRODUCT_CONSTANTS= CONSUMER_PRODUCT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_IMAGE,
        pageTitle: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_PRODUCT_SHOW,
        pageDesc: CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_PRODUCT_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorConsumerProductName: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private consumerProductService: ConsumerProductService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CONSUMER_PRODUCT_CONSTANTS = CONSUMER_PRODUCT_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;
            this.loadConsumerProduct();
        });
    }
    ngOnInit() {
        this.createConsumerProductForm();
        this.loadConsumerProduct();
    }
    createConsumerProductForm(): FormGroup {
        this.consumerProduct.manufacturingDate = this.dateService.getDateString(this.consumerProduct.manufacturingDate);
        return this.consumerProductForm = this._formBuilder.group({
            id               : [this.consumerProduct.id],
            name             : [this.consumerProduct.name, []],
            description      : [this.consumerProduct.description, []],
            deviceId         : [this.consumerProduct.deviceId, []],
            imieId           : [this.consumerProduct.imieId, []],
            modelNo          : [this.consumerProduct.modelNo, []],
            lotNo            :  [this.consumerProduct.lotNo, []],
            manufacturingDate: [this.consumerProduct.manufacturingDate, []]
        });
    }

    loadConsumerProduct() {
        $('body').addClass('loading');
        this.consumerProductService.getConsumerProduct(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerProduct = data['data'][0];
            this.consumerProductForm = this.createConsumerProductForm();
            this.consumerProduct.manufacturingDate = this.dateService.getDateString(this.consumerProduct.manufacturingDate);
            this.breadCrumService.pushStep(CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_LIST_LINK, CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST_ALIAS.replace(":alias",this.consumerProduct.consumerProductType.alias),true);
            this.breadCrumService.pushStep(CONSUMER_PRODUCT_CONSTANTS.LABEL.CONSUMER_PRODUCT_PRODUCT_SHOW_LINK, CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_PRODUCT_SHOW, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_PRODUCT_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        this.consumerProductService.uploadImage(this.files, this.consumerProduct.id)
        .subscribe(
        data => {
            this.consumerProduct = data['data'][0];
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

        let pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }


   markDeleted(consumerProduct) {
       this.sweetAlertService.deleteCheck(this, consumerProduct);
   }

   remove(consumerProduct) {
      consumerProduct.logo=null;
      this.consumerProduct.manufacturingDate = this.dateService.getDateString(this.consumerProduct.manufacturingDate);
      this.consumerProductService.deleteProfilePicture(consumerProduct)
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
