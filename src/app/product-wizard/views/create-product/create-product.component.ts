import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup,FormControl,Validators, FormArray} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_WIZARD_CONSTANTS } from '../../constants';
import { PRODUCT_WIZARD_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { ProductWizardService } from '../../services/product-wizard.service';
import { NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create-product.component.html'
})

export class CreateProductComponent implements OnInit {
    loading = false;
    submitted = false;
    product:any={};
    client:any={};
    currentUser=undefined;
    orderWizard:any={};
    alias:any={};
    orderWizardObj:any={};
    manufacturerProduct:any={};
    vendor:any={};
    vendors = [];
    selectedVendor='';
    company:any={};
    companies = [];
    selectedCompany='';
    subscription:any={};
    clientSubscriptions = [];
    boardProductType = {};
    machineProductType = {};
    selectedSubscription={id:0,alias: ''};
    products=[];
    orderCount:any=0;
    productTypes:any=[];
    boards = [];
    invoiceId = '';
    selectedBoard= {id: 0};
    machine:any={};
    board:any={};
    machines = [];
    selectedMachine={id:0};
    isVendorSupport= false;
    boardForm:FormGroup;
    productForm:FormGroup;
    PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
    PRODUCT_WIZARD_VALIDATOR=PRODUCT_WIZARD_VALIDATOR;
    APP_CONFIG=APP_CONFIG;
    ERROR_CODE=ERROR_CODE;
    paginationItems=[];
    itemSize=0;
    setting = {
        entity: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_ORDER,
        pageTitle: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE,
        pageDesc: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE_DESC
    };
    steps=[];
    totalSize=0;
    currentPage=0;
    pageSize=8;
    totalPages=0;
    buttonName= PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ACTION_CREATE;
    backUrl= PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_CREATE_PRODUCT;
    formValidation= {
        duplicateErrorProductname:false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productWizardService: ProductWizardService,
                private productTypeService: ProductTypeService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG=APP_CONFIG;
        this.PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
        this.PRODUCT_WIZARD_VALIDATOR=PRODUCT_WIZARD_VALIDATOR;
        this.ERROR_CODE=ERROR_CODE;
        this.currentPage=1;
        this.pageSize=this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ORDER_LIST_LINK, PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, true);
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE_LINK,PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_CREATE_PRODUCT,false);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME+ " :: "+ this.PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD);
        this.route.params.subscribe( params => {
            this.alias=params.alias;
            this.loadOrderWizard();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.boardForm=this.createProductForm();
        this.addOrderCount();
        this.loadClient();
        this.loadSubscription();

        setTimeout(function(){
             $('#clientSubscriptionIDDetails').select2({
                  width: '100%'
             });
        }, 500);

        this.loadVendors();
        $('#vendorsIDSelect2').select2({
              width: '100%',

        });
        this.loadCompanies();
        $('#companiesIDSelect2').select2({
               width: '100%'
        });
        $('#machineSelect').select2({
                   width: '100%'
        });
        $('#boardSelect').select2({
                width: '100%'
        });

    }

    createProductForm(): FormGroup{
        this.selectedSubscription = this.orderWizard.clientSubscription ? this.orderWizard.clientSubscription : {};
        this.selectedCompany = this.orderWizard.companyId ? this.orderWizard.companyId : '';
        this.selectedVendor = this.orderWizard.vendorId ? this.orderWizard.vendorId : '';
        if(this.orderWizard.invoiceId){
            return this.boardForm=this._formBuilder.group({
                id                     : [0],
                vendorId               : [this.orderWizard.vendorId ? this.selectedVendor : ''],
                clientSubscription     : [this.selectedSubscription.id, [Validators.required]],
                companyId              : [this.orderWizard.companyId ? this.selectedCompany : ''],
                vendorSupported        : [this.orderWizard.vendorId && this.orderWizard.vendorId.length > 0],
                products               : this._formBuilder.array([]),
            });
        }
        if(!this.orderWizard.invoiceId){
            return this.boardForm=this._formBuilder.group({
                id                     : [0],
                vendorId               : [{value: this.orderWizard.vendorId ? this.selectedVendor : '', disabled: !this.isVendorSupport}, [Validators.required]],
                clientSubscription     : [this.orderWizard.clientSubscription ? this.selectedSubscription : '',[Validators.required]],
                companyId              : [{value: this.orderWizard.companyId ? this.selectedCompany : '', disabled: this.isVendorSupport}, [Validators.required]],
                vendorSupported        : [this.orderWizard.vendorId && this.orderWizard.vendorId.length > 0],
                products               : this._formBuilder.array([]),
            });
        }
    }

    loadOrderWizard() {
        $('body').addClass('loading');
        this.productWizardService.getOrderWizard(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.orderWizard = data['data'][0];
            this.boardForm = this.createProductForm();
            this.showVendorCompany();
            this.addOrderCount();
            this.loadSubscription();
            this.loadCompanies();
            this.loadVendors();
            this.loadBoards(this.orderWizard.boardProductType);
            this.loadMachines(this.orderWizard.machineProductType);

            $('#machineSelect').select2({
                       width: '100%'
            });
            $('#boardSelect').select2({
                    width: '100%'
            });
            $('#clientSubscriptionIDDetails').select2({
                  width: '100%'
            });
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.loading = false;
        });
    }

    showVendorCompany() {
        this.isVendorSupport = this.boardForm.get('vendorSupported').value;
        if (this.isVendorSupport) {
            $('#showCompany').hide();
            $('#showVendor').show();
            this.boardForm.get('companyId').disable();
            this.boardForm.get('vendorId').enable();

        }else {
           $('#showCompany').show();
           $('#showVendor').hide();
           this.boardForm.get('vendorId').disable();
           this.boardForm.get('companyId').enable();
        }
    }

    createProduct(form){
        this.orderWizardObj=this.boardForm.value;
        delete this.orderWizard.vendorSupported;
        this.orderWizard.orderMachines = this.orderWizardObj.products;
        this.orderWizard.clientSubscription = this.selectedSubscription;
        this.orderWizard.companyId = this.selectedCompany;
        this.orderWizard.vendorId = this.selectedVendor;
        $("body").addClass("loading");
        this.productWizardService.updateOrderWizard(this.orderWizard)
        .subscribe(
            data => {
                $("body").removeClass("loading");
                if (data['hasError']){
                    this.assignResponseError(data);
                } else {
                    this.sweetAlertService.createConfirmation(this.setting.entity);
                    this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
                }
                this.loading = false;

            },
            failure => {
                $("body").removeClass("loading");
                this.httpResponseService.showErrorResponse(failure);
                this.loading = false;

            }
        );
    }

    loadVendors() {
        let _self = this;
        this.productWizardService.getVendors()
        .subscribe(
        data => {
            this.vendors = data['data'];
            $('#vendorsIDSelect2').select2({
                width: '100%',
                display: false

            });
            $('#vendorsIDSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedVendor=selectId;
                if (_self.selectedVendor.length > 0) {
                    _self.boardForm.get('vendorId').setErrors(null);
                }else {
                     _self.boardForm.get('vendorId').setErrors({'required': true});
                }
            });
        },
        () => {
            this.loading = false;
        } );

    }

    loadCompanies() {
        let _self = this;
        this.productWizardService.getCompanies()
        .subscribe(
        data => {
            this.companies = data['data'];
            $('#companiesIDSelect2').select2({
                width: '100%'
            });
            $('#companiesIDSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompany=selectId;
                if (_self.selectedCompany.length > 0) {
                    _self.boardForm.get('companyId').setErrors(null);
                }else {
                     _self.boardForm.get('companyId').setErrors({'required': true});
                }

            });
        },
        () => {
            this.loading = false;
        } );

    }

    loadSubscription() {
        var _self = this;
        this.productWizardService.getClientSubscriptions()
        .subscribe(
        data => {
            this.clientSubscriptions = data['data'];
            setTimeout(function(){
                $('#clientSubscriptionIDDetails').select2({
                    width: '100%'
                });
                $('#clientSubscriptionIDDetails').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectSubscription(selectId);

                    if (selectId > 0) {
                        _self.boardForm.get('clientSubscription').setErrors(null);
                    }else {
                         _self.boardForm.get('clientSubscription').setErrors({'required': true});
                    }

                });
            },1000);

        },
        () => {
            this.loading = false;
        } );

    }

    selectSubscription(subscriptionId) {
        for (let i = 0; i < this.clientSubscriptions.length; i++) {
            if (this.clientSubscriptions[i].id == subscriptionId) {
                this.selectedSubscription = this.clientSubscriptions[i];
                this.boardForm.get('clientSubscription').setErrors(null);
            }
        }
    }


    buildProduct(product) {
        if(!this.orderWizard.invoiceId){
            this.selectedBoard = this.product.boardId ? this.product.boardId : {};
            this.selectedMachine = this.product.machineId ? this.product.machineId : {};
            let productForm = new FormGroup({
                id: new FormControl(product ? product.id : 0 ),
                imieId: new FormControl(product ? product.imieId : '', Validators.required),
                deviceId: new FormControl(product ? product.deviceId : '', Validators.required),
                machineId: new FormControl(this.product.machineId ? this.selectedMachine : 0, Validators.required),
                boardId: new FormControl(this.product.boardId ? this.selectedBoard : 0, Validators.required),
                price: new FormControl(product ? product.price: '', [Validators.required,Validators.pattern('^[0-9]{1,4}$')]),
            });
            return productForm;
        }
        if(this.orderWizard.invoiceId){
            let productForm = new FormGroup({
                id: new FormControl(product ? product.id : 0 ),
                imieId: new FormControl(product ? product.imieId : '', Validators.required),
                deviceId: new FormControl(product ? product.deviceId : '', Validators.required),
                machineId: new FormControl(product ? product.machineId: 0, Validators.required),
                boardId: new FormControl(product ? product.boardId: 0, Validators.required),
                price: new FormControl(product ? product.price: '', [Validators.required,Validators.pattern('^[0-9]{1,4}$')]),
            });
            return productForm;
        }

    }

    addOrderCount() {
        for (let  i = 0; i < this.orderWizard.orderCount ; i++ ) {
            (this.boardForm.get('products') as FormArray).push(this.buildProduct(this.orderWizard.orderMachines[i] ? this.orderWizard.orderMachines[i] : {}));
        }
    }

    loadMachines(machineProductType) {
        let _self = this;
        this.productWizardService.getMachines(machineProductType.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.machines = data['data'];
                var activeMachines=[];
                for(let i=0; i<this.machines.length; i++){
                    if(this.machines[i].status=="Accepted"){
                        activeMachines.push(this.machines[i])
                    }
                    if(this.machines[i].status=="Dispatched" && this.machines[i].createdBy==this.machines[i].ownerId){
                        activeMachines.push(this.machines[i])
                    }
                }
                this.machines=activeMachines;
                setTimeout(function(){
                    for(var i=0;i<_self.orderWizard.orderCount;i++){
                        $('#machineSelect'+i).select2({
                            width: '100%'
                        });
                        $('#machineSelect'+i).on('select2:select', function(e){
                           var attr = $(this).attr("id");
                           var id = parseInt(attr.replace('machineSelect',''));
                           var selectId = e.params.data.id;
                            _self.selectMachine(selectId,id);
                        });
                    }
                },1000);
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadBoards(boardProductType) {
        let _self = this;
        this.productWizardService.getBoards(boardProductType.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.boards = data['data'];
                var activeBoards=[];
                for(let i=0; i<this.boards.length; i++){
                    if(this.boards[i].status=="Accepted"){
                        activeBoards.push(this.boards[i])
                    }
                    if(this.boards[i].status=="Dispatched" && this.boards[i].createdBy==this.boards[i].ownerId){
                        activeBoards.push(this.boards[i])
                    }
                }
                this.boards=activeBoards;
                setTimeout(function(){
                    for(var i=0;i<_self.orderWizard.orderCount;i++){
                        $('#boardSelect'+i).select2({
                            width: '100%'
                        });
                        $('#boardSelect'+i).on('select2:select', function(e){
                           var attr = $(this).attr("id");
                           var id = parseInt(attr.replace('boardSelect',''));
                           var selectId = e.params.data.id;
                            _self.selectBoard(selectId,id);
                        });
                    }
                },1000);
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectMachine(machineId,index) {
        let found = false;
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[i].machineId == machineId) {
                var selectedMachine = this.machines[i];
                var productForm = (this.boardForm.get('products') as FormArray).at(index);
                productForm.get('machineId').setValue(selectedMachine.machineId ? selectedMachine.machineId : 0);
                productForm.get('machineId').setErrors(null);
                found = true; break;

            }
        }
        found ? productForm.get('machineId').setErrors(null) : productForm.get('machineId').setErrors({'required': true});

    }

    selectBoard(boardId,index) {
        let found = false;
        for (let i = 0; i < this.boards.length; i++) {
            if (this.boards[i].boardId == boardId) {
                var selectedBoard = this.boards[i];
                var productForm = (this.boardForm.get('products') as FormArray).at(index);
                productForm.get('imieId').setValue(selectedBoard.imieId ? selectedBoard.imieId : '');
                productForm.get('deviceId').setValue(selectedBoard.deviceId ? selectedBoard.deviceId:'');
                productForm.get('boardId').setValue(selectedBoard.boardId ? selectedBoard.boardId:0);
                productForm.get('boardId').setErrors(null);
                found = true; break;
                found ? productForm.get('boardId').setErrors(null) : productForm.get('boardId').setErrors({'required': true});
            }
        }

    }

    list() {
        this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === PRODUCT_WIZARD_CONSTANTS.FIELD.MACHINEID) {
                this.productForm.get('machineId').setErrors({'duplicate': true});
            }
            if (data.error.errorField === PRODUCT_WIZARD_CONSTANTS.FIELD.DEVICE_ORDERMACHINE_DEVICEID) {
                this.productForm.get('deviceId').setErrors({'duplicate': true});
            }
            if (data.error.errorField === PRODUCT_WIZARD_CONSTANTS.FIELD.IMIEID) {
                this.productForm.get('imieId').setErrors({'duplicate': true});
            }
            if (data.error.errorField === PRODUCT_WIZARD_CONSTANTS.FIELD.BOARDID) {
                this.productForm.get('boardId').setErrors({'duplicate': true});
            }
        }
        if (data.error.errorCode == ERROR_CODE.code_29) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }

    validateForm(f){
        let valid = true;
        for (let  i = 0; i < this.orderWizard.orderCount ; i++ ) {
            let productForm1 = (this.boardForm.get('products') as FormArray).at(i);
            let deviceId1=  productForm1.get('deviceId').value;
            let imieId1=  productForm1.get('imieId').value;
            let machineId1=  productForm1.get('machineId').value;
            let boardId1=  productForm1.get('boardId').value;
            for (let j = 0; j < this.orderWizard.orderCount ; j++ ) {
                let productForm2 = (this.boardForm.get('products') as FormArray).at(j)
                let deviceId2=  productForm2.get('deviceId').value;
                if ( i != j && deviceId1 == deviceId2) {
                    productForm2.get('deviceId').setErrors({'duplicate': true});
                    valid = false;
                }
                let imieId2=  productForm2.get('imieId').value;
                if ( i != j && imieId1 == imieId2) {
                    productForm2.get('imieId').setErrors({'duplicate': true});
                    valid = false;
                }
                let machineId2=  productForm2.get('machineId').value;
                if ( i != j && machineId1 == machineId2) {
                     productForm2.get('machineId').setErrors({'duplicate': true});
                     valid = false;
                }
                let boardId2=  productForm2.get('boardId').value;
                if ( i != j && boardId1 == boardId2) {
                     productForm2.get('boardId').setErrors({'duplicate': true});
                     valid = false;
                }
            }

        }
        return valid;
    }

    loadClient() {
        this.productWizardService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    replaceText(text){
        text= text.replace('Vendor', this.client.vendorNickName?this.client.vendorNickName:'Vendor');
        text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
        return text;

    }
}