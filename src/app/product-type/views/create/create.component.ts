import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_TYPE_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_VALIDATOR } from '../../validator';
import { COMPONENT_VALIDATOR } from '../../validator';
import { ATTRIBUTE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductTypeService } from '../../services/product-type.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'create.component.html',
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    isPayment = false;
    errorMessage = '';
    attributeType: any = {};
    client: any= {};
    currentUser= undefined;
    component: any = {};
    subscription: any = {};
    name: any = {};
    description: any = {};
    file: any = {};
    alias: any = {};
    productType: any = {};
    productTypes = [];
    attributes = [];
    subscriptions = [];
    providers = [];
    selectedProvider= '';
    files = undefined;
    components = [{ attributes: [{}] }];
    attributeTypes = [];
    productTypeForm: FormGroup;
    componentForm: FormGroup;
    productCategory: any= {};
    productCategorys: any= [];
    selectedSubscription: any= {id: 0, productCategory: ''};
    PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
    PRODUCT_TYPE_VALIDATOR = PRODUCT_TYPE_VALIDATOR;
    ATTRIBUTE_VALIDATOR = ATTRIBUTE_VALIDATOR;
    COMPONENT_VALIDATOR = COMPONENT_VALIDATOR;
    APP_CONFIG = APP_CONFIG;
    ERROR_CODE = ERROR_CODE;
    paginationItems = [];
    itemSize = 0;
    setting = {
        entity: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE,
        pageTitle: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_CREATE,
        pageDesc: PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_CREATE_DESC,
    };
    steps = [];
    totalSize = 0;
    currentPage = 0;
    pageSize = 8;
    totalPages = 0;
    buttonName = PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE_ACTION_CREATE;
    backUrl = PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST;
    constructor(
                private router: Router,
                private productTypeService: ProductTypeService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private alertService: AlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.PRODUCT_TYPE_VALIDATOR = PRODUCT_TYPE_VALIDATOR;
        this.ATTRIBUTE_VALIDATOR = ATTRIBUTE_VALIDATOR;
        this.COMPONENT_VALIDATOR = COMPONENT_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle(
            APP_CONFIG.APP_NAME +
            ' :: ' +
            this.PRODUCT_TYPE_CONSTANTS.LABEL.PRODUCT_TYPE
        );

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
        var _self = this;
        this.productTypeForm = this.createProductTypeForm();
        this.loadSubscription();
        this.loadClient();
        $('#subscriptionIdSelect2').select2({
            width: '100%'
        });
        $('#providerSelect2').select2({
            width: '100%'
        });

        $('#providerSelect2').on('select2:select', function(e){
            var selectId = e.params.data.id;
            _self.selectedProvider = selectId;
        });

    }

    createProductTypeForm(): FormGroup {
        return this.productTypeForm = this._formBuilder.group({
            id                   : [this.productType.id],
            ownerId              : [this.productType.ownerId],
            alias                : [this.productType.alias],
            name                 : [this.productType.name, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description          : [this.productType.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            productCategory      : [this.productType.productCategory, [Validators.required]],
            payment              : [''],
            file                 : [this.file, [Validators.required]],
            subscriptionId       : ['', [Validators.required]],
            modelNo              : [this.productType.modelNo, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            provider             : [this.productType.provider ? this.productType.provider : null]
        });
    }

    processFile() {
        this.productType = this.productTypeForm.value;
        $('body').addClass('loading');
        this.productType.boardStatus = 'New';
        this.productType.machineStatus = 'New';
        this.productType.provider = this.selectedProvider;
        if (this.selectedSubscription.id > 0) {
            this.productType.subscriptionId = this.selectedSubscription;
            }else {
            delete this.productType.subscriptionId;
        }
        this.productTypeService.uploadFile(this.files, this.productType.name, this.productType.description, this.productType.modelNo, this.selectedSubscription.alias, this.selectedSubscription.subscription.productCategory.alias, this.productType.alias ? this.productType.alias : '', this.selectedProvider,this.productType.payment,)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if(data['hasError']){
                this.assignResponseError(data);
            }else{
                this.productType = data['data'][0];
                this.sweetAlertService.createConfirmation(this.client.productTypeNickName);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
            }
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
        });
    }

    onFileChange(event) {
        this.files = event.target.files[0];
        this.productTypeForm.get('file').setErrors(null);
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

    validateForm() {
        let error = true;
        if (this.selectedSubscription.id == 0) {
            this.productTypeForm.get('subscriptionId').setErrors({'required': true});
            error = false;
        }else {
            this.productTypeForm.get('subscriptionId').setErrors(null);
        }
        if (!this.files) {
            this.productTypeForm.get('file').setErrors({'required': true});
            error = false;
        }
        return error;

    }

    loadSubscription() {
        var _self = this;
        this.productTypeService.getSubscription()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.subscriptions = data['data'];
                var activeSubscriptions=[];
                for(let i=0; i<this.subscriptions.length; i++){
                    if(this.subscriptions[i].active){
                        activeSubscriptions.push(this.subscriptions[i])
                    }
                }
                this.subscriptions=activeSubscriptions;
                $('#subscriptionIdSelect2').select2({
                width: '100%'
                });
            $('#subscriptionIdSelect2').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectSubscription(selectId);
            });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectSubscription(subscriptionId) {
        var found = false;
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].id == subscriptionId) {
                this.selectedSubscription = this.subscriptions[i];
                this.productTypeForm.get('productCategory').setValue(this.selectedSubscription.subscription ? this.selectedSubscription.subscription.productCategory.name : '');
                found = true; break;
            }
        }
        found ? this.productTypeForm.get('subscriptionId').setErrors(null) : this.productTypeForm.get('subscriptionId').setErrors({'required': true});
    }

    list() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(
            this.client.productTypeNickName+ ' ' + 'List',
            PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST,
            true
            );
            this.breadCrumService.pushStep(
            'Create' + ' ' + this.client.productTypeNickName,
            PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_CREATE,
            false
            );
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }
}
