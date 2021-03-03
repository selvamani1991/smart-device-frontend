import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { PRODUCT_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ProductService } from '../../services/product.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    product: any= {};
    client: any= {};
    currentUser= undefined;
    alias: any= {};
    products= [];
    productType: any= {};
    board: any= {};
    productTypes: any= [];
    machines: any= [];
    boards: any= [];
    machine: any= {};
    manufacturerDate: any;
    selectedProductType= {id: 0};
    selectedMachine= {id: 0};
    selectedBoard= {id: 0, imieId: '', deviceId: ''};
    selectedClientSubscription:any= '';
    clientSubscriptions= [];
    subscriptionId: any= {};
    productForm: FormGroup;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    PRODUCT_VALIDATOR= PRODUCT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: PRODUCT_CONSTANTS.LABEL.PRODUCT,
        pageTitle: PRODUCT_CONSTANTS.LABEL.PRODUCT_CREATE,
        pageDesc: PRODUCT_CONSTANTS.LABEL.PRODUCT_CREATE_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= PRODUCT_CONSTANTS.LABEL.PRODUCT_ACTION_CREATE;
    backUrl= PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST;
    formValidation= {
        duplicateErrorProductname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private productTypeService: ProductTypeService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.PRODUCT_VALIDATOR = PRODUCT_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;

        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
         this.productForm = this.createProductForm();
         this.loadProductType();
         this.loadMachines();
         this.loadBoards();
         this.loadClient();
         this.loadClientSubscription();
         $('#manufacturerDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.manufacturerDate = selectedDate;
                 this.productForm.get('manufacturerDate').setErrors(null);

             }
         });
         $('#machine').select2({
             width: '100%'
         });
         $('#board').select2({
              width: '100%'
         });
         $('#clientSubscriptionSelect2').select2({
             width: '100%'
         });
    }

    createProductForm(): FormGroup {
        return this.productForm = this._formBuilder.group({
            id                              : [this.product.id],
            name                            : [this.product.name, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description                     : [this.product.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            deviceId                        : [this.product.deviceId, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            imieId                          : [this.product.imieId, [Validators.required,Validators.pattern(/^\d{2,}$/)]],
            url                             : [this.product.url, [Validators.required]],
            machine                         : ['', [Validators.required]],
            board                           : ['', [Validators.required]],
            status                          : 'New',
            manufacturerDate                : [this.product.manufacturerDate,[Validators.required]],
            subscriptionId                  : ['', [Validators.required]],
        });
    }

    createProduct() {
        this.product = this.productForm.value;
        $('body').addClass('loading');
        if (this.selectedMachine.id > 0) {
            this.product.machine = this.selectedMachine;
        }else {
            delete this.product.machine;
        }

        if (this.selectedBoard.id > 0) {
            this.product.board = this.selectedBoard;
        }else {
            delete this.product.board;
        }
        this.product.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.product.productType = this.productType;
        this.product.subscriptionId = this.selectedClientSubscription;
        this.productService.saveProduct(this.product)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.client.productNickName);
                //this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.productType.alias]);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST]);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.productType.alias]);
            $('body').removeClass('loading');
        });
    }

    loadProductType() {
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
            this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.productType.alias),true);
            this.breadCrumService.pushStep('Create' + ' ' + this.client.productNickName, PRODUCT_CONSTANTS.URL.PRODUCT_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    loadMachines() {
        let _self = this;
        this.productService.getMachines(999, this.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.machines=data['data'];
                var activeMachines=[];
                for(let i=0; i<this.machines.length; i++){
                    if(!this.machines[i].orderWizardProduct){
                        if(this.machines[i].status=="Dispatched" && this.machines[i].createdBy==this.machines[i].ownerId){
                            activeMachines.push(this.machines[i])
                        }
                        if(this.machines[i].status=="Accepted"){
                            activeMachines.push(this.machines[i])
                        }
                    }
                }
                this.machines=activeMachines;
                $('#machine').select2({
                    width: '100%'
                });
                $('#machine').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectMachine(selectId);

                });
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadBoards() {
        let _self = this;
        this.productService.getBoards(999, this.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.boards = data['data'];
                 var activeBoards=[];
                for(let i=0; i<this.boards.length; i++){
                    if(!this.boards[i].orderWizardProduct){
                        if(this.boards[i].status=="Dispatched" && this.boards[i].createdBy==this.boards[i].ownerId){
                            activeBoards.push(this.boards[i])
                        }
                        if(this.boards[i].status=="Accepted"){
                            activeBoards.push(this.boards[i])
                        }
                    }
                }
                this.boards=activeBoards;
                $('#board').select2({
                    width: '100%'
                });
                $('#board').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectBoard(selectId);
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }


    selectMachine(machineId) {
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[i].id == machineId) {
                this.selectedMachine = this.machines[i];
                this.productForm.get('machine').setErrors(null);
            }
        }
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.productForm.get('name').setErrors({'duplicate': true});
            if (data.error.errorField == PRODUCT_CONSTANTS.FIELD.BOARDID) {
                this.productForm.get('board').setErrors({'duplicate': true});
            }
            if (data.error.errorField == PRODUCT_CONSTANTS.FIELD.MACHINEID) {
                this.productForm.get('machine').setErrors({'duplicate': true});
            }
            if (data.error.errorField == PRODUCT_CONSTANTS.FIELD.DEVICEID) {
                this.productForm.get('deviceId').setErrors({'duplicate': true});
            }
            if (data.error.errorField == PRODUCT_CONSTANTS.FIELD.IMIEID) {
                this.productForm.get('imieId').setErrors({'duplicate': true});
            }
        }
        if (data.error.errorCode == ERROR_CODE.code_29) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }

    list() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.productType.alias]);
    }

    loadClientSubscription() {
        let _self = this;
        this.productService.getClientSubscription()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.clientSubscriptions = data['data'];
                 var activeSubscriptions=[];
                for(let i=0; i<this.clientSubscriptions.length; i++){
                    if(this.clientSubscriptions[i].active){
                        activeSubscriptions.push(this.clientSubscriptions[i])
                    }
                }
                this.clientSubscriptions=activeSubscriptions;
                $('#clientSubscriptionSelect2').select2({
                    width: '100%'
                });
                $('#clientSubscriptionSelect2').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectedClientSubscription=selectId;
                    if(_self.selectedClientSubscription.length > 0 ){
                        _self.productForm.get('subscriptionId').setErrors(null);
                    }
                    else {
                         _self.productForm.get('subscriptionId').setErrors({'required': true});
                    }
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    validateForm() {
        let valid = true;
        if (this.selectedBoard.id == 0) {
            this.productForm.get('board').setErrors({'required': true});
            valid = false;
        } else {
            this.productForm.get('board').setErrors(null);
        }
        if (this.selectedMachine.id == 0) {
            this.productForm.get('machine').setErrors({'required': true});
            valid = false;
        } else {
            this.productForm.get('machine').setErrors(null);
        }
        return valid;
    }

    selectBoard(boardId) {
        let found = false;
        for (let i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id == boardId) {
                this.selectedBoard = this.boards[i];
                this.productForm.get('imieId').setValue(this.selectedBoard.imieId);
                this.productForm.get('deviceId').setValue(this.selectedBoard.deviceId);
                this.productForm.get('board').setErrors(null);
                found = true; break;
            }
        }
        found ? this.productForm.get('board').setErrors(null) : this.productForm.get('board').setErrors({'required': true});
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadProductType();
        },
        () => {
            this.loading = false;
        });
    }

    replaceText(text){
            text= text.replace('Product', this.client.productNickName?this.client.productNickName:'Product');
            return text;

    }
}
