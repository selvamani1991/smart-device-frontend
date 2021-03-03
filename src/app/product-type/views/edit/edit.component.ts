import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_VALIDATOR } from '../../validator';
import { COMPONENT_VALIDATOR } from '../../validator';
import { ATTRIBUTE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import {ProductTypeService } from '../../services/product-type.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    files = undefined;
    client: any= {};
    currentUser=undefined;
    file: any = {};
    productType: any= {};
    component: any= {};
    form: any= {};
    subscription: any = {};
    attributeTypes= [];
    subscriptions= [];
    providers= [];
    selectedProvider= '';
    components= [{attributes: [{}]}];
    selectedProductType= {id: 0};
    productTypeForm: FormGroup;
    componentForm: FormGroup;
    selectedSubscription: any= {id: 0, productCategory: '',alias:''};
    paginationItems= [];
    itemSize= 0;
    productCategory: any= {};
    productCategorys: any= [];
    selectedProductCategory= {id: 0, alias: ''};
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    PRODUCT_TYPE_VALIDATOR= PRODUCT_TYPE_VALIDATOR;
    COMPONENT_VALIDATOR= COMPONENT_VALIDATOR;
    ATTRIBUTE_VALIDATOR= ATTRIBUTE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_EDIT,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_EDIT_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_ACTION_EDIT;
    backUrl= PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorProductTypename: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productTypeService: ProductTypeService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.PRODUCT_TYPE_VALIDATOR = PRODUCT_TYPE_VALIDATOR;
        this.COMPONENT_VALIDATOR = COMPONENT_VALIDATOR;
        this.ATTRIBUTE_VALIDATOR = ATTRIBUTE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadProductType(this.alias);
        });
         this.providers = [
            {'id': 'http', 'name': 'http'},
            {'id': 'mqtt', 'name': 'mqtt'},
            {'id': 'azure', 'name': 'azure'}
         ];
         this.authenticationService.sessionChange$.subscribe(
             () => {
                 this.currentUser = authenticationService.getCurrentUser();
             }
         );
    }

    ngOnInit() {
        let _self = this;
        this.productTypeForm = this.createProductTypeForm();
        this.loadClient();
        $('#productCategorySelect').select2({
            width: '100%'
        });
        setTimeout(function(){
            $('#subscriptionsIdSelect2Edit').select2({
                width: '100%'
            });
        },500);
        setTimeout(function(){
            $('#providerSelect2').select2({
                width: '100%'
            });
            $('#providerSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProvider = selectId;
            });
        },1000);
    }

    createProductTypeForm(): FormGroup {
        this.selectedSubscription = this.productType.subscriptionId ? this.productType.subscriptionId : '';
        this.selectedProvider = this.productType.provider ? this.productType.provider : '';
        return this.productTypeForm = this._formBuilder.group({
             id               : [this.productType.id],
             ownerId          : [this.productType.ownerId],
             alias            : [this.productType.alias],
             logo             : [this.productType.logo],
             name             : [this.productType.name, [Validators.required,  Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
             description      : [this.productType.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
             payment          : [this.productType.payment],
             productCategory  : [this.productType.productCategory ? this.productType.productCategory.name:'', [Validators.required]],
             subscriptionId   : [this.selectedSubscription,[Validators.required]],
             file             : [this.file],
             modelNo          : [this.productType.modelNo, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
             provider         : [this.selectedProvider]

        });
    }

    loadProductType(alias) {
        this.productTypeService.getProductType(alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
            this.productTypeForm = this.createProductTypeForm();
            this.loadSubscription();
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
           this.loading = false;
        });
    }

     loadSubscription() {
         var _self = this;
         this.productTypeService.getSubscription()
         .subscribe(
         data => {
             if (!data['hasError']) {
                 this.subscriptions = data['data'];
                 this.productTypeForm = this.createProductTypeForm();
                 var activeSubscriptions=[];
                 for(let i=0; i<this.subscriptions.length; i++){
                     if(this.subscriptions[i].active){
                         activeSubscriptions.push(this.subscriptions[i])
                     }
                 }
                 this.subscriptions=activeSubscriptions;
                 this.selectSubscription(this.productType.subscriptionId);
                 setTimeout(function(){
                      $('#subscriptionsIdSelect2Edit').select2({
                           width: '100%'
                      });
                      $('#subscriptionsIdSelect2Edit').on('select2:select', function(e){
                          var selectId = e.params.data.id;
                          _self.selectSubscription(selectId);

                      });
                 },500);
             }
             this.loading = false;
         },
         () => {
             this.loading = false;
         });
     }

    list() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
    }

    onFileChange(event) {
        this.files = event.target.files[0];
        this.productTypeForm.get('file').setErrors(null);
    }

    processFile() {
        this.productType = this.productTypeForm.value;
        $('body').addClass('loading');
        this.productType.boardStatus = 'New';
        this.productType.machineStatus = 'New';
        this.productType.subscriptionId = this.selectedSubscription.alias;
        this.file = this.files;
        this.productTypeService.uploadFile(this.files?this.files:'', this.productType.name, this.productType.description,this.productType.modelNo, this.selectedSubscription ? this.selectedSubscription.alias:'', this.selectedSubscription.subscription?this.selectedSubscription.subscription.productCategory.alias:'', this.productType.alias ? this.productType.alias : '', this.selectedProvider ? this.selectedProvider : '',this.productType.payment)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.productType = data['data'][0];
            this.productType = this.productTypeForm.value;
            this.assignResponseError(data);
            this.sweetAlertService.updateConfirmation(this.client.productTypeNickName);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
        });
    }

    selectSubscription(subscriptionId) {
        var found = false;
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].alias == subscriptionId) {
                this.selectedSubscription = this.subscriptions[i];
                this.productTypeForm.get('productCategory').setValue(this.selectedSubscription.subscription ? this.selectedSubscription.subscription.productCategory.name : '');
                this.productTypeForm.get('subscriptionId').setErrors(null);
                found = true; break;
            }
        }
        found ? this.productTypeForm.get('subscriptionId').setErrors(null) : this.productTypeForm.get('subscriptionId').setErrors({'required': true});
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName+ ' ' + 'List',PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST,true);
            this.breadCrumService.pushStep('Edit' + ' ' +  this.client.productTypeNickName, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }

    validateForm() {
        let error = true;
        if (!this.files) {
            this.productTypeForm.get('file').setErrors({'required': true});
            error = false;
        }
        return error;

    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == PRODUCT_TYPE_CONSTANTS.FIELD.NAME) {
                this.productTypeForm.get('name').setErrors({ duplicate: true });
            //}
        }
        if (data.error.errorCode == ERROR_CODE.code_29) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }
}
