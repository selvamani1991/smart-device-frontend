import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup,Validators } from '@angular/forms';
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
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    selector: 'order-detail',
    moduleId: module.id.toString(),
    templateUrl: 'order-create.component.html'
})

export class OrderCreateComponent implements OnInit {
    loading = false;
    submitted = false;
    alias:any={};
    client:any={};
    currentUser=undefined;
    products=[];
    orderWizard:any={};
    orderWizards = [];
    productTypes = [];
    manufacturerDate: any;
    selectedProductType='';
    boardManufacturer:any={};
    boardManufacturers = [];
    selectedBoardManufacturer='';
    machineManufacturer:any={};
    machineManufacturers = [];
    selectedMachineManufacturer='';
    productTypeForm:FormGroup;
    PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
    PRODUCT_WIZARD_VALIDATOR=PRODUCT_WIZARD_VALIDATOR;
    APP_CONFIG=APP_CONFIG;
    ERROR_CODE=ERROR_CODE;
    paginationItems=[];
    itemSize=0;
    setting = {
           entity: PRODUCT_WIZARD_CONSTANTS.LABEL.ORDER_WIZARD,
           pageTitle: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE,
           pageDesc: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE_DESC,
    };
    steps=[];
    totalSize=0;
    currentPage=0;
    pageSize=8;
    totalPages=0;
    buttonName = PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ACTION_CREATE;
    backUrl = PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST;
    formValidation= {
        duplicateErrorProductname:false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productWizardService: ProductWizardService,
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
        this.pageSize=this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ORDER_LIST_LINK, PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, true);
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE_LINK,PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_CREATE_PRODUCT,false);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle(APP_CONFIG.APP_NAME +' :: ' +this.PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD);
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
        var _self=this;
        this.productTypeForm=this.createProductTypeForm();
        $('#manufacturerDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.manufacturerDate = selectedDate;
                 this.productTypeForm.get('manufacturerDate').setErrors(null);

             }
        });
        this.loadProductTypes();
        $('#productTypeID').select2({
             width: '100%'
        });

        this.loadBoardManufacturers();
        setTimeout(function(){
            $('#boardManufacturerID').select2({
                    width: '100%'
            });
        },500);
        this.loadMachineManufacturers();
        this.loadClient();
        setTimeout(function(){
            $('#machineManufacturersID').select2({
                 width: '100%'
            });
        },500);

    }

    createProductTypeForm(): FormGroup {
        return this.productTypeForm = this._formBuilder.group({
            id                   : [this.orderWizard.id],
            orderCount           : [this.orderWizard.orderCount,[Validators.required]],
            productTypeId          : ['', [Validators.required]],
            machineManufacturerId  : ['', [Validators.required]],
            boardManufacturerId    : ['', [Validators.required]],
            manufacturerDate       : [this.orderWizard.manufacturerDate,[Validators.required]],
            installation           : ['preInstallation'],

        });
    }

    createOrderWizard(form) {
        this.orderWizard = this.productTypeForm.value;
        $('body').addClass('loading');
        this.orderWizard.productTypeId = this.selectedProductType;
        this.orderWizard.manufacturerDate = this.dateService.getLongFromString(this.manufacturerDate);
        this.orderWizard.machineManufacturerId = this.selectedMachineManufacturer;
        this.orderWizard.boardManufacturerId = this.selectedBoardManufacturer;
        this.orderWizard.installation == 'preInstallation' ? true : false;
        this.productWizardService.saveProductOrder(this.orderWizard)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.orderWizard = data['data'][0];
                this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
            this.loading = false;
        });
    }

    loadProductTypes() {
        let _self = this;
        this.productWizardService.getWizardProductTypes()
        .subscribe(
        data => {
            this.productTypes = data['data'];
            var activeProductTypes=[];
            for(let i=0; i<this.productTypes.length; i++){
                if(this.productTypes[i].active && !this.productTypes[i].deleted){
                    activeProductTypes.push(this.productTypes[i])
                }
            }
            this.productTypes=activeProductTypes;
            $('#productTypeID').select2({
                width: '100%'
            });
            $('#productTypeID').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if(_self.selectedProductType.length > 0 ){
                    _self.productTypeForm.get('productTypeId').setErrors(null);
                }
                else {
                     _self.productTypeForm.get('productTypeId').setErrors({'required': true});
                }
            });
        },
        () => {
            this.loading = false;
        } );

    }

    loadBoardManufacturers() {
        let _self = this;
        this.productWizardService.getWizardBoardManufacturers()
        .subscribe(
        data => {
            this.boardManufacturers = data['data'];
            var activeBoardManufactures=[];
            for(let i=0; i<this.boardManufacturers.length; i++){
                if(this.boardManufacturers[i].active){
                    activeBoardManufactures.push(this.boardManufacturers[i])
                }
            }
            this.boardManufacturers=activeBoardManufactures;
            $('#boardManufacturerID').select2({
                width: '100%'
            });
            $('#boardManufacturerID').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedBoardManufacturer=selectId;
                if(_self.selectedBoardManufacturer.length > 0 ){
                    _self.productTypeForm.get('boardManufacturerId').setErrors(null);
                }else {
                     _self.productTypeForm.get('boardManufacturerId').setErrors({'required': true});
                }
            });
        },
        () => {
            this.loading = false;
        } );

    }

    loadMachineManufacturers() {
        let _self = this;
        this.productWizardService.getWizardMachineManufacturers()
        .subscribe(
        data => {
            this.machineManufacturers = data['data'];
            var activeManufactures=[];
            for(let i=0; i<this.machineManufacturers.length; i++){
                if(this.machineManufacturers[i].active){
                    activeManufactures.push(this.machineManufacturers[i])
                }
            }
            this.machineManufacturers=activeManufactures;
            $('#machineManufacturersID').select2({
                width: '100%'
            });
            $('#machineManufacturersID').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedMachineManufacturer=selectId;
                if(_self.selectedMachineManufacturer.length > 0 ){
                    _self.productTypeForm.get('machineManufacturerId').setErrors(null);
                }
                else {
                     _self.productTypeForm.get('machineManufacturerId').setErrors({'required': true});
                }
            });
        },
        () => {
            this.loading = false;
        } );

    }

    list() {
        this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
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
        if(this.currentUser.userType!='SuperAdmin'){
            text= text.replace('ProductType', this.client.productTypeNickName?this.client.productTypeNickName:'ProductType');
            return text;
        }

    }
}