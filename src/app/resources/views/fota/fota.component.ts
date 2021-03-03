import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup, Validators,FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RESOURCES_CONSTANTS } from '../../constants';
import { RESOURCES_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
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
    templateUrl: 'fota.component.html'
})

export class FotaComponent implements OnInit {
    resources:any={};
    services=[];
    form:any={};
    client:any={};
    product:any={};
    currentUser=undefined;
    medias:any=[];
    selectedProductType:any='';
    productTypes:any=[];
    loading = false;
    active=false;
    resourcesForm:FormGroup;
    RESOURCES_CONSTANTS=RESOURCES_CONSTANTS;
    RESOURCES_VALIDATOR=RESOURCES_VALIDATOR;
    APP_CONFIG=APP_CONFIG;
    SUCCESS_CODE=SUCCESS_CODE;
    paginationItems=[];
    itemSize=0;
    ERROR_CODE=ERROR_CODE;
    setting = {
        entity: RESOURCES_CONSTANTS.LABEL.RESOURCES,
        pageTitle: RESOURCES_CONSTANTS.LABEL.RESOURCES_COMPANY_LIST,
        pageDesc: RESOURCES_CONSTANTS.LABEL.RESOURCES_COMPANY_LIST_DESC
    };
    steps=[];
    totalSize=0;
    currentPage=0;
    pageSize=8;
    query='';
    totalPages=0;
    zone: any= {};
    zones: any= [];
    selectedZone: any= {id: ''};
    selectedCompany: any= '';
    selectedClientCompanyProduct: any= '';
    selectedCompanyBuilding: any= '';
    clientCompanyProducts: any= [];
    company: any= {};
    companyBuilding: any= {};
    companyBuildings: any= [];
    companies: any= [];
    oldCompanies: any= [];
    productDatas: any= [];
    selectedProduct: any = '';
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private authenticationService:AuthenticationService,
                private resourcesService: ResourcesService,
                private alertService: AlertService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private tooltipService: TooltipService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG=APP_CONFIG;
        this.SUCCESS_CODE=SUCCESS_CODE;
        this.RESOURCES_CONSTANTS=RESOURCES_CONSTANTS;
        this.RESOURCES_VALIDATOR=RESOURCES_VALIDATOR;
        this.currentPage=1;
        this.pageSize=this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(RESOURCES_CONSTANTS.LABEL.RESOURCES_FOTA_LINK,RESOURCES_CONSTANTS.URL.RESOURCES_FOTA,true);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME+ " :: "+ this.RESOURCES_CONSTANTS.LABEL.RESOURCES);
        this.authenticationService.sessionChange$.subscribe(
        value => {
            this.currentUser = authenticationService.getCurrentUser();
        });

    }

    ngOnInit() {
        setTimeout(function(){
        $('#productTypeSelect').select2({
             width: '100%',
        });
        },500);
        this.resourcesForm=this.createResourcesForm();
        this.loadZones();
        this.loadClient();
            $('#zone').select2({
            width: '100%',
            disabled: true
        });

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

             $('#productSelect2').select2({
             width: '100%',
             disabled: true
        });
        },500);

    }

    createResourcesForm(): FormGroup{
        return this.resourcesForm= this._formBuilder.group({
            productType       : ['', [Validators.required]],
            zone              : [0],
            company           : [0],
            companyBuilding   : [0],
            product           : [0],
        });
    }

    loadProductTypes(){
        var _self=this;
        this.resourcesService.getCurrentProductType()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes=data["data"];
                $('#productTypeSelect').select2({
                    width: '100%',
                     disabled:false
                });
                $('#productTypeSelect').on("select2:select",function(e){
                    var selectId = e.params.data.id;
                    _self.selectedProductType = selectId;
                    if(_self.selectedProductType.length > 0 ){
                        _self.resourcesForm.get('productType').setErrors(null);
                    }
                    else {
                        _self.resourcesForm.get('productType').setErrors({'required': true});
                    }
                })
            }
            this.loading = false;
        },
        error => {
                  this.loading = false;
        });
    }

    selectProductType(productTypeId){
        this.selectedProductType=productTypeId;
    }

    showProductList(){
        this.loadMedias();
    }

    loadMedias(){
        this.resourcesService.getFirmware(this.selectedProductType)
        .subscribe(
        data => {
            this.medias = data["data"];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });

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
                    width: '100%',
                    disabled: false
                });
                $('#zone').on('select2:select', function(e){
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
                $('#company').on('select2:select', function(e){
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
                $('#companyBuilding').on('select2:select', function(e){
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
        if ( this.selectedCompanyBuilding.length > 0 && this.selectedProductType.length > 0 ) {
            this.resourcesService.getProductByCompanyBuildingAndProductType(this.selectedCompanyBuilding, this.selectedProductType)
            .subscribe(
            data => {
                if (!data['hasError']) {
                    this.clientCompanyProducts = data['data'];
                    $('#productSelect2').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#productSelect2').on('select2:select', function(e){
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
        this.selectedProduct = productId;
        }

    }

    loadFotaResponse(){
        var request: any = {
            productTypeId: this.selectedProductType
        };

        if (this.selectedZone.length > 0) {
            request.zoneId = this.selectedZone;
        }

        if (this.selectedCompany.length > 0) {
            request.companyId = this.selectedCompany;
        }
        if (this.selectedCompanyBuilding.length > 0) {
            request.companyBuildingId = this.selectedCompanyBuilding;
        }
        if (this.selectedProduct.length > 0) {
            request.productId = this.selectedProduct;
        }
        this.resourcesService.getFirmwareMediaByProductType(this.selectedProductType,this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.medias = data['data'];
            this.paginationItems = this.medias;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
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
        this.loadFotaResponse();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadFotaResponse();
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