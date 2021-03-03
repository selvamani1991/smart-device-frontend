import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { PRODUCT_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import {ProductService } from '../../services/product.service';
import { DateService } from '../../../shared/services/date.service';
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
    product: any= {};
    products: any= [];
    client: any= {};
    board: any= {};
    currentUser= undefined;
    boards: any= [];
    clientSubscriptions= [];
    machines: any= [];
    machine: any= {};
    productType: any= {};
    productTypes= [];
    manufacturerDate: any;
    selectedProductType= {id: 0, name: ''};
    selectedBoard= {id: 0, imieId: '', deviceId: ''};
    selectedMachine= {id: 0, name: ''};
    selectedClientSubscription= '';
    productForm: FormGroup;
    paginationItems= [];
    itemSize= 0;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    PRODUCT_VALIDATOR= PRODUCT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_CONSTANTS.LABEL.PRODUCT,
        pageTitle: PRODUCT_CONSTANTS.LABEL.PRODUCT_EDIT,
        pageDesc: PRODUCT_CONSTANTS.LABEL.PRODUCT_EDIT_DESC
    };
    steps= [];
    pageSize= 8;
    buttonName= PRODUCT_CONSTANTS.LABEL.PRODUCT_ACTION_EDIT;
    backUrl= PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorProductname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private _formBuilder: FormBuilder,
                private dateService: DateService,
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
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
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
        this.productForm = this.createProductForm();

        $('#manufacturerDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.manufacturerDate = selectedDate;
                this.productForm.get('manufacturerDate').setErrors(null);
            }
        });
        this.loadClient();
        $('#clientSubscriptionsSelect2').select2({
            width: '100%',
        });
        $('#machine').select2({
            width: '100%',
        });
    }

    createProductForm(): FormGroup {
        this.selectedBoard = this.product.board ? this.product.board : {};
        this.selectedMachine = this.product.machine ? this.product.machine : {};
        this.selectedClientSubscription = this.product.subscriptionId ? this.product.subscriptionId : '';
        this.product.manufacturerDate = this.dateService.getDateString(this.product.manufacturerDate);
        return this.productForm = this._formBuilder.group({
            id                            : [this.product.id],
            alias                         : [this.product.alias],
            ownerId                       : [this.product.ownerId],
            name                          : [this.product.name, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description                   : [this.product.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            imieId                        : [this.product.imieId, [Validators.required, Validators.pattern(/^\d{2,}$/)]],
            deviceId                      : [this.product.deviceId, [Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)]],
            board                         : [this.product.board ? this.selectedBoard.id : 0, [Validators.required]],
            machine                       : [this.product.machine ? this.selectedMachine.id : 0, [Validators.required]],
            subscriptionId                : [this.product.subscriptionId ? this.selectedClientSubscription : '', [Validators.required]],
            manufacturerDate              : [this.product.manufacturerDate, [Validators.required]],
            url                           : [this.product.url, [Validators.required]],
            logo                          : [this.product.logo],

        });
    }

    loadSelect2Board() {
        let _self = this;
        if (this.selectedBoard) {
            $('#board').select2({
                width: '100%',
                params: {
                    data: this.selectedBoard
                }
            });
            $('#board').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectBoard(selectId);
            });
        }
    }

    loadSelect2Machine() {
        let _self = this;
        if (this.selectedMachine) {
            $('#machine').select2({
                width: '100%',
                params: {
                    data: this.selectedMachine
                }
            });
            $('#machine').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectMachine(selectId);
            });
        }
    }

    loadSelect2ClientSubscription() {
        let _self = this;
        if (this.selectedClientSubscription) {
            $('#clientSubscriptionsSelect2').select2({
                width: '100%',
                params: {
                    data: this.selectedClientSubscription
                }
            });
            $('#clientSubscriptionsSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectClientSubscription(selectId);
            });
        }
    }

    updateProduct() {
        let product = this.productForm.value;
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
        this.product.name = product.name;
        this.product.description = product.description;
        this.product.imieId = product.imieId;
        this.product.deviceId = product.deviceId;
        this.product.url = product.url;
        this.product.subscriptionId = this.selectedClientSubscription;
        this.product.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.productService.updateProduct(this.product)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.productNickName);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
            this.loading = false;
        });
    }

    selectMachine(machineId) {
        let found = false;
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[i].id == machineId) {
                this.selectedMachine = this.machines[i];
                this.productForm.get('machine').setErrors(null);
                found = true; break;
            }
        }
        found ? this.productForm.get('machine').setErrors(null) : this.productForm.get('machine').setErrors({'required': true});
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

    selectClientSubscription(subscriptionId) {
        for (let i = 0; i < this.clientSubscriptions.length; i++) {
            if (this.clientSubscriptions[i].alias == subscriptionId) {
                this.selectedClientSubscription = this.clientSubscriptions[i].alias;
                this.productForm.get('subscriptionId').setErrors(null);
            }
        }
    }

    loadProduct(alias) {
        this.productService.getProduct(alias)
        .subscribe(
        data => {
            this.product = data['data'][0];
            this.productForm = this.createProductForm();
            this.manufacturerDate = this.product.manufacturerDate;
            this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.product.productType.alias),true);
            this.breadCrumService.pushStep('Edit' + ' ' +  this.client.productNickName, PRODUCT_CONSTANTS.URL.PRODUCT_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
            this.loadMachines();
            this.loadBoards();
            this.loadClientSubscription();
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
           this.loading = false;
        });
    }

    list() {
        this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
    }

    loadMachines() {
        this.productService.getMachines(999, this.product.productType.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.machines = data['data'];
                this.loadSelect2Machine();
                var activeMachines=[];
                for(let i=0; i<this.machines.length; i++){
                    if(this.machines[i].status=="Dispatched" && this.machines[i].createdByAdmin){
                        activeMachines.push(this.machines[i])
                    }
                    if(this.machines[i].status=="Accepted"){
                        activeMachines.push(this.machines[i])
                    }
                    if(this.machines[i].machineId==this.product.machine.machineId){
                        activeMachines.push(this.machines[i])
                    }
                }

                this.machines=activeMachines;
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadBoards() {
        this.productService.getBoards(999, this.product.productType.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.boards = data['data'];
                this.loadSelect2Board();
                var activeBoards=[];
                for(let i=0; i<this.boards.length; i++){
                    if(this.boards[i].status=="Dispatched" && this.boards[i].createdByAdmin){
                        activeBoards.push(this.boards[i])
                    }
                    if(this.boards[i].status=="Accepted"){
                        activeBoards.push(this.boards[i])
                    }
                    if(this.boards[i].boardId==this.product.board.boardId){
                        activeBoards.push(this.boards[i])
                    }
                }
                this.boards=activeBoards;
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadClientSubscription() {
        let _self = this;
        this.productService.getClientSubscription()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.clientSubscriptions = data['data'];
                this.loadSelect2ClientSubscription();
                var activeSubscriptions=[];
                for(let i=0; i<this.clientSubscriptions.length; i++){
                    if(this.clientSubscriptions[i].active){
                        activeSubscriptions.push(this.clientSubscriptions[i])
                    }
                }
                this.clientSubscriptions=activeSubscriptions;
                $('#clientSubscriptionsSelect2').select2({
                    width: '100%'
                });
                $('#clientSubscriptionsSelect2').on('select2:select', function(e) {
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

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            //if (data.error.errorField === PRODUCT_CONSTANTS.FIELD.NAME) {
                this.productForm.get('name').setErrors({'duplicate': true});
            //}
            if (data.error.errorField === PRODUCT_CONSTANTS.FIELD.DEVICEID) {
                this.productForm.get('deviceId').setErrors({'duplicate': true});
            }
            if (data.error.errorField === PRODUCT_CONSTANTS.FIELD.IMIEID) {
                this.productForm.get('imieId').setErrors({'duplicate': true});
            }
        }
        if (data.error.errorCode == ERROR_CODE.code_29) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadProduct(this.alias)
        },
        () => {
            this.loading = false;
        });
    }
}
