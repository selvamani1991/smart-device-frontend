import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TELEMETRIC_DATA_CONSTANTS } from '../../constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { TelemetricDataService } from '../../services/telemetric-data.service';
import { ProductService} from '../../../product/services/product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'telemetric.component.html'
})

export class TelemetricComponent implements OnInit {
    telemetricDatas: any = [];
    components: any = [];
    telemetricData: any= {};
    consumerProduct: any= {};
    consumerDevice: any= {};
    client: any= {};
    distributor: any= {};
    company: any= {};
    product: any= {};
    startDate=undefined;
    endDate=undefined;
    currentTeleMetricPage='';
    componentId: any= 0;
    telemetricForm: FormGroup;
    selectedComponent: any= {};
    productType: any= {};
    processTime: any= {};
    component: any= 0;
    form: any= {};
    distributorProduct: any= {};
    companyProduct: any= {};
    alias: any;
    services= [];
    currentUser: any= {};
    loading = false;
    TELEMETRIC_DATA_CONSTANTS= TELEMETRIC_DATA_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA,
        pageTitle: TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST,
        pageDesc: TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    constructor(
                private authenticationService: AuthenticationService,
                private route: ActivatedRoute,
                private router: Router,
                private _formBuilder: FormBuilder,
                private telemetricDataService: TelemetricDataService,
                private productService: ProductService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.TELEMETRIC_DATA_CONSTANTS = TELEMETRIC_DATA_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA);
        this.route.params.subscribe( params => {
               this.alias = params.alias;
               this.loadProduct();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();

            }
        );
    }

    ngOnInit() {
        let _self = this;
        $('#teleStartDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.startDate = selectedDate;
                if(this.startDate && this.endDate){
                     _self.loadTelemetricData(this.componentId);
                }

            }
        });
        $('#teleEndDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
                if(this.startDate && this.endDate){
                     _self.loadTelemetricData(this.componentId);
                }
            }
        });

        this.telemetricForm = this.createTeleMetricForm();
        this.loadClient();
    }

    createTeleMetricForm(): FormGroup {
        return this.telemetricForm = this._formBuilder.group({
            startDate       : ['', [Validators.required]],
            endDate         : ['', [Validators.required]],
        });
    }

    loadTelemetricData(componentId) {
        this.loading = true;
        $('body').addClass('loading');

        var startDateStr:any='';
        var endDateStr:any='';
        if (this.startDate){
            startDateStr= this.dateService.getLongFromString(this.startDate);
        }
        if (this.endDate){
            endDateStr= this.dateService.getLongFromString(this.endDate);
        }
        this.telemetricDataService.getAllTelemetricDatas(this.currentPage, this.pageSize, this.alias, componentId,startDateStr,endDateStr)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.telemetricDatas = data['data'];
            this.paginationItems = this.telemetricDatas;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (var i = 0; i < this.telemetricDatas.length; i++) {
                this.telemetricDatas[i].processTime = this.dateService.getDateTimeStringUTC(this.telemetricDatas[i].processTime);
            }

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadProduct() {
        var _self = this;
        $('body').addClass('loading');
        this.productService.getProduct(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.product = data['data'][0];
            this.componentId = this.product.productType.components[0].id;
            this.component = this.componentId;
            this.selectedComponent = this.product.productType.components[0];

            this.loadTelemetricData(this.componentId);
            this.telemetricForm = this.createTeleMetricForm();
            setTimeout(function(){
                $('#component').select2({
                    width: '100%'
                });
                $('#component').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectComponent(selectId);
                });
            }, 1000);

            if(this.currentUser && this.currentUser.userType == 'Consumer'){
                this.breadCrumService.pushStep(PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_DEVICE_LIST_ALIAS.replace(":alias",this.consumerDevice.product.alias),true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }

            if(this.currentUser && this.currentUser.userType == 'clientAdmin'){
                this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.product.productType.alias),true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }
            if(this.currentUser && this.currentUser.userType == 'companyAdmin'){
               this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyBuildingNickName+ ' ' + this.client.productNickName, COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT,true);
               this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }
            if(this.currentUser && this.currentUser.userType == 'vendorAdmin'){
                if(this.telemetricService.getCurrentPage()=='distributor'){
                    this.breadCrumService.pushStep('Assigned' + ' ' + this.client.distributorNickName+ ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_DISTRIBUTOR_PRODUCT,true);
                    this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
                }

                if(this.telemetricService.getCurrentPage()=='company'){
                     this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName+ ' ' + this.client.productNickName, VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT,true);
                     this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
                }
            }

            if(this.currentUser && this.currentUser.userType == 'distributorAdmin'){
                this.breadCrumService.pushStep('Assigned' + ' ' + this.client.companyNickName+ ' ' + this.client.productNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT,true);
                this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }
            if(this.currentUser && this.currentUser.userType == 'companyBuildingAdmin'){
                 this.breadCrumService.pushStep(this.client.companyBuildingNickName+ ' ' + this.client.productNickName + ' ' + 'List', COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT,true);
                 this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }
            if(this.currentUser && this.currentUser.userType == 'SuperAdmin'){
                 this.breadCrumService.pushStep(PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_DEVICE_LIST_ALIAS.replace(":alias",this.consumerDevice.product.alias),true);
                 this.breadCrumService.pushStep(TELEMETRIC_DATA_CONSTANTS.LABEL.TELEMETRIC_DATA_LIST_LINK, TELEMETRIC_DATA_CONSTANTS.URL.TELEMETRIC_DATA_LIST, false);
            }
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    selectComponent(componentId) {
        this.componentId = componentId;
        for (let i = 0; i < this.product.productType.components.length; i++) {
            if (this.product.productType.components[i].id == componentId && !this.product.productType.components[i].deleted) {
                this.selectedComponent = this.product.productType.components[i];
            }
        }
        this.loadTelemetricData(this.componentId);
    }

    changePage(event) {
        this.currentPage = event;
        this.loadTelemetricData(this.componentId);
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadTelemetricData(this.componentId);
    }

    loadClient() {
        this.productService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.loadProduct();
        },
        () => {
            this.loading = false;
        });
    }
}
