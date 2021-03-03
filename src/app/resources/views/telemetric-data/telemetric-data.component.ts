import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RESOURCES_CONSTANTS } from '../../constants';
import { RESOURCES_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { ResourcesService } from '../../services/resources.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'telemetric-data.component.html'
})

export class TelemetricDataComponent implements OnInit {
    resources: any = {};
    services = [];
    form: any = {};
    client: any = {};
    currentUser=undefined;
    startDate=undefined;
    endDate=undefined;
    product: any = {};
    products: any = [];
    selectedProductType: any = '';
    productTypes: any = [];
    loading = false;
    active = false;
    resourcesForm: FormGroup;
    RESOURCES_CONSTANTS = RESOURCES_CONSTANTS;
    RESOURCES_VALIDATOR = RESOURCES_VALIDATOR;
    APP_CONFIG = APP_CONFIG;
    SUCCESS_CODE = SUCCESS_CODE;
    paginationItems = [];
    itemSize = 0;
    ERROR_CODE = ERROR_CODE;
    setting = {
        entity: RESOURCES_CONSTANTS.LABEL.RESOURCES,
        pageTitle: RESOURCES_CONSTANTS.LABEL.RESOURCES_COMPANY_LIST,
        pageDesc: RESOURCES_CONSTANTS.LABEL.RESOURCES_COMPANY_LIST_DESC
    };
    steps = [];
    totalSize = 0;
    currentPage = 1;
    pageSize = 8;
    query = '';
    totalPages = 0;
    zone: any = {};
    zones: any = [];
    telemetricDatas= [];
    selectedZone: any = { id: '' };
    companies: any = [];
    oldCompanies: any = [];
    selectedCompany: any = '';
    companyBuilding: any = {};
    companyBuildings: any = [];
    selectedCompanyBuilding: any = '';
    clientCompanyProducts: any = [];
    components = [];
    selectedClientCompanyProduct: any = '';
    selectedComponent: any = '';
    productDatas: any = [];
    selectedProduct=undefined;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private resourcesService: ResourcesService,
                private alertService: AlertService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private tooltipService: TooltipService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.currentPage = 1;
        this.RESOURCES_CONSTANTS = RESOURCES_CONSTANTS;
        this.RESOURCES_VALIDATOR = RESOURCES_VALIDATOR;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(RESOURCES_CONSTANTS.LABEL.RESOURCES_TELEMETRIC_DATA_LINK, RESOURCES_CONSTANTS.URL.RESOURCES_TELEMETRIC_DATA, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle(APP_CONFIG.APP_NAME + " :: " + this.RESOURCES_CONSTANTS.LABEL.RESOURCES);
        this.authenticationService.sessionChange$.subscribe(
        value => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        let _self = this;
        this.loadClient();
        this.loadZones();
        setTimeout(function(){
            $('#zone').select2({
                width: '100%'
            });
        },500);

        this.loadCompanies();
        setTimeout(function(){
            $('#company').select2({
                width: '100%',
                disabled: true
            });
        },500);
        setTimeout(function(){
            $('#companyBuilding').select2({
                width: '100%',
                disabled: true
            });
        },500);
        this.loadProductTypes();
        setTimeout(function(){
            $('#productTypeSelect').select2({
                width: '100%'
            });
        },500);
        setTimeout(function(){
            $('#componentSelect').select2({
                width: '100%',
            });
        },500);
        this.loadProduct();
        setTimeout(function(){
            $('#productSelect2').select2({
                width: '100%',
                disabled: true
            });
        },500);
         $('#startDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.startDate = selectedDate;
            }
        });
        $('#endDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
            }
        });
        this.resourcesForm = this.createResourcesForm();

    }

    createResourcesForm(): FormGroup {
        return this.resourcesForm = this._formBuilder.group({
            product         : [0],
            productType     : [0, [Validators.required]],
            zone            : [0],
            company         : [0],
            component       : [0],
            companyBuilding : [0],
            startDate       : [''],
            endDate         : [''],

        });
    }

    loadProductTypes() {
        var _self = this;
        this.resourcesService.getProductTypes()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                var activeProductType=[];
                for(let i=0; i<this.productTypes.length; i++){
                    if(this.productTypes[i].active && !this.productTypes[i].deleted){
                        activeProductType.push(this.productTypes[i])
                    }
                }
                this.productTypes=activeProductType;
                $('#productTypeSelect').select2({
                    width: '100%',
                    disabled: false
                });
                $('#productTypeSelect').on("select2:select", function (e) {
                    var selectId = e.params.data.id;
                    _self.selectProductType(selectId);
                })
            }
            this.loading = false;
        },
        error => {
            this.loading = false;
        });
    }

    selectProductType(productTypeId) {
        var _self = this;
        for(var i=0;i<this.productTypes.length;i++ ){
            if(this.productTypes[i].alias == productTypeId){
                this.selectedProductType = productTypeId;
                this.components=this.productTypes[i].components;
                var activeProductTypeComponent=[];
                for(let i=0; i<this.productTypes[i].components.length; i++){
                    if(!this.productTypes[i].components.deleted){
                        activeProductTypeComponent.push(this.productTypes[i].components)
                    }
                }
                this.productTypes[i].components=activeProductTypeComponent;
                $('#componentSelect').select2({
                    width: '100%',
                    disabled: false
                });
                 $('#componentSelect').on("select2:select", function (e) {
                    var selectId = e.params.data.id;
                    _self.selectedComponent= selectId;
                })
            }
        }

    }

    loadZones() {
        var _self = this;
        this.resourcesService.getZones()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.zones = data['data'];
                var activeZones=[];
                for(let i=0; i<this.zones.length; i++){
                     if(this.zones[i].active){
                         activeZones.push(this.zones[i])
                     }
                }
                this.zones=activeZones;
                $('#zone').select2({
                    width: '100%'
                });
                $('#zone').on('select2:select', function (e) {
                    var selectId = e.params.data.id;
                    _self.selectZone(selectId);
                });
            }
            this.loading = false;
        },
        error => {
            this.loading = false;
        });
    }

    selectZone(zoneId) {
        this.selectedZone = zoneId;
        this.companies = [];
        for (let i = 0; i < this.oldCompanies.length; i++) {
            if (this.selectedZone == this.oldCompanies[i].zoneId) {
                this.companies.push(this.oldCompanies[i]);
            }
            if (this.selectedZone == 0) {
                this.companies.push(this.oldCompanies[i]);
            }
        }
        if (this.selectedZone.length > 5) {
            $('#company').select2({
                 width: '100%',
                 disabled: false
            });
        this.loadCompanies();
        }else {
            $('#company').select2({
                width: '100%',
                disabled: true
            });
        }
    }

    loadCompanies() {
        var _self = this;
        this.resourcesService.getCompanyOfClient()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companies = data['data'];
                this.oldCompanies = this.companies;
                var activeCompanies=[];
                for(let i=0; i<this.companies.length; i++){
                     if(this.companies[i].active){
                         activeCompanies.push(this.companies[i])
                     }
                }
                this.companies=activeCompanies;
                $('#company').select2({
                    width: '100%',
                    disabled: false
                });
                $('#company').on('select2:select', function (e) {
                    var selectId = e.params.data.id;
                    _self.selectCompany(selectId);
                });
            }
            this.loading = false;
        },
        error => {
            this.loading = false;
        });
    }

    selectCompany(companyId) {
        this.selectedCompany = companyId;
        if (this.selectedCompany.length > 5) {
            $('#companyBuilding').select2({
                 width: '100%',
                 disabled: false
            });
        this.loadCompanyBuildings();
        }else {
            $('#companyBuilding').select2({
                width: '100%',
                disabled: true
            });
        }
    }

    loadCompanyBuildings() {
        var _self = this;
        this.resourcesService.getBuilding(this.selectedCompany)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companyBuildings = data['data'];
                var activeCompanyBuildings=[];
                for(let i=0; i<this.companyBuildings.length; i++){
                     if(this.companyBuildings[i].active){
                         activeCompanyBuildings.push(this.companyBuildings[i])
                     }
                }
                this.companyBuildings=activeCompanyBuildings;
                $('#companyBuilding').select2({
                    width: '100%',
                    disabled: false
                });
                $('#companyBuilding').on('select2:select', function (e) {
                    var selectId = e.params.data.id;
                    _self.selectCompanyBuilding(selectId);
                });
            }
            this.loading = false;
        },
        error => {
            this.loading = false;
        });
    }

    selectCompanyBuilding(companyBuildingId) {
        this.selectedCompanyBuilding = companyBuildingId;
        if (this.selectedCompanyBuilding.length > 0) {
            this.loadProduct();
        }
    }

    loadProduct() {
        var _self = this;
        if (this.selectedCompanyBuilding.length > 0 && this.selectedProductType.length > 0) {
            this.resourcesService.getProductByCompanyBuildingAndProductType(this.selectedCompanyBuilding, this.selectedProductType)
            .subscribe(
            data => {
                if (!data['hasError']) {
                    this.clientCompanyProducts = data['data'];
                    var activeCompanyProducts=[];
                    for(let i=0; i<this.clientCompanyProducts.length; i++){
                         if(this.clientCompanyProducts[i].active){
                             activeCompanyProducts.push(this.clientCompanyProducts[i])
                         }
                    }
                    this.clientCompanyProducts=activeCompanyProducts;
                    $('#productSelect2').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#productSelect2').on('select2:select', function (e) {
                        var selectId = e.params.data.id;
                        _self.selectClientCompanyProduct(selectId);
                    });

                }
                this.loading = false;
            },
            error => {
                this.loading = false;
            });
        } 
    }

    selectClientCompanyProduct(productId) {
        if(productId == 0){
            this.selectedProduct = undefined;
        }else{
            this.selectedClientCompanyProduct = productId;
            this.selectedProduct = this.selectedClientCompanyProduct;
        }
    }

    loadTelemetricResponse(){
        var request: any = {
            productTypeId: this.selectedProductType
        };
    
        if (this.selectedZone.length > 0) {
            request.zoneId = this.selectedZone;
        }
    
        if (this.selectedCompany.length > 0) {
            request.companyId = this.selectedCompany;
        }
    
        if (this.selectedProduct.length > 0) {
            request.productId = this.selectedProduct;
        }
        var startDateStr:any='';
        var endDateStr:any='';
        if (this.startDate){
            startDateStr= this.dateService.getLongFromString(this.startDate);
        }
        if (this.endDate){
            endDateStr= this.dateService.getLongFromString(this.endDate);
        }
        this.resourcesService.getTelemetricData(request.productId, this.currentPage, this.pageSize, this.selectedComponent,startDateStr,endDateStr)
        .subscribe(
        data => {
            this.telemetricDatas = data['data'];
            this.paginationItems = this.telemetricDatas;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.telemetricDatas.length; i++) {
                if (this.telemetricDatas[i].entryTime && this.telemetricDatas[i].entryTime > 0 ) {
                    this.telemetricDatas[i].entryTime = this.dateService.getDateString(this.telemetricDatas[i].entryTime);
                }else {
                    this.telemetricDatas[i].entryTime = 'N/A';
                }

            }
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    
    }

    loadClient() {
        this.resourcesService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadTelemetricResponse();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadTelemetricResponse();
    }

    replaceText(text){
        if(this.currentUser.userType!='SuperAdmin'){
            text= text.replace('ProductType', this.client.productTypeNickName?this.client.productTypeNickName:'ProductType');
            text= text.replace('Product', this.client.productNickName?this.client.productNickName:'Product');
            text= text.replace('Building', this.client.companyBuildingNickName?this.client.companyBuildingNickName:'CompanyBuilding');
            text= text.replace('Distributor', this.client.distributorNickName?this.client.distributorNickName:'Distributor');
            text= text.replace('Vendor', this.client.vendorNickName?this.client.vendorNickName:'Vendor');
            text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
            return text;
        }

    }
}