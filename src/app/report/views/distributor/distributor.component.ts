import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { REPORT_CONSTANTS } from '../../constants';
import { REPORT_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ReportService } from '../../services/report.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'distributor.component.html'
})

export class DistributorComponent implements OnInit {
    report: any= {};
    services= [];
    distributorProducts= [];
    form: any= {};
    product: any= {};
    currentUser= undefined;
    startDate= undefined;
    endDate= undefined;
    gridView= true;
    graphView= false;
    vendor: any= {};
    client: any= {};
    vendors: any= [];
    productDatas: any= [];
    distributor: any= {};
    distributors: any= [];
    selectedDistributor: any= '';
    selectedCompany: any= '';
    selectedCompanyBuilding: any= '';
    selectedProductType: any= '';
    selectedProduct: any= '';
    selectedDistributorProduct: any= '';
    selectedZone: any= {id: ''};
    selectedProductData= {};
    productDataReport= '';
    company: any= {};
    companies: any= [];
    components: any= [];
    companyBuilding: any= {};
    companyBuildings: any= [];
    productType: any= {};
    productData: any= {};
    productTypes: any= [];
    oldVendors: any= [];
    zones: any= [];
    products: any= [];
    alias: any= {};
    loading = false;
    active= false;
    reportForm: FormGroup;
    REPORT_CONSTANTS= REPORT_CONSTANTS;
    REPORT_VALIDATOR= REPORT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: REPORT_CONSTANTS.LABEL.REPORT,
        pageTitle: REPORT_CONSTANTS.LABEL.REPORT_COMPANY_LIST,
        pageDesc: REPORT_CONSTANTS.LABEL.REPORT_COMPANY_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    query= '';
    totalPages= 0;
    constructor(
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private reportService: ReportService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.REPORT_CONSTANTS = REPORT_CONSTANTS;
        this.REPORT_VALIDATOR = REPORT_VALIDATOR;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.REPORT_CONSTANTS.LABEL.REPORT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
        () => {
           this.currentUser = authenticationService.getCurrentUser();
        });
    }

    ngOnInit() {
       $('#startDate').datepicker({
          changeMonth: true,
          changeYear: true,
          dateFormat: 'dd/mm/yy',
          onSelect: (selectedDate) => {
              this.startDate = selectedDate;
              this.reportForm.get('startDate').setErrors(null);
          }
       });

       $('#endDate').datepicker({
          changeMonth: true,
          changeYear: true,
          dateFormat: 'dd/mm/yy',
          onSelect: (selectedDate) => {
              this.endDate = selectedDate;
              this.reportForm.get('endDate').setErrors(null);
          }
       });

        this.loadCompanies();
       setTimeout(function(){

       $('#companySelect2').select2({
            width: '100%',
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
            $('#productType').select2({
            width: '100%'
       });
       },500);

       setTimeout(function(){
       $('#productSelect2').select2({
            width: '100%',
            disabled: true
       });
       },500);

        this.loadClient();
       this.reportForm = this.createReportForm();
    }

    createReportForm(): FormGroup {
        return this.reportForm = this._formBuilder.group({
            startDate         : ['', [Validators.required]],
            endDate           : ['', [Validators.required]],
            company           : [0],
            companyBuilding   : [0],
            product           : [0,[Validators.required]],
            productType       : ['', [Validators.required]],

        });
    }

    loadProduct() {
        var _self = this;
        if ( this.selectedCompanyBuilding.length > 0 && this.selectedProductType.length > 0 ) {
            this.reportService.getProductByCompanyBuildingAndProductType(this.selectedCompanyBuilding, this.selectedProductType)
            .subscribe(
            data => {
                if (!data['hasError']) {
                    this.distributorProducts = data['data'];
                    var activeDistributorsProduct=[];
                    for(let i=0; i<this.distributorProducts.length; i++){
                        if(this.distributorProducts[i].active && this.distributorProducts[i].status=='Accepted'){
                            activeDistributorsProduct.push(this.distributorProducts[i])
                        }
                    }
                    this.distributorProducts=activeDistributorsProduct;
                    $('#productSelect2').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#productSelect2').on('select2:select', function(e){
                        var selectId = e.params.data.id;
                        _self.selectDistributorProduct(selectId);
                        /*if (_self.selectedDistributorProduct.length > 0) {
                            _self.reportForm.get('product').setErrors(null);
                        }else {
                            _self.reportForm.get('product').setErrors({'required': true});
                        }*/
                    });

                }
                this.gridView = true;
                this.graphView = false;
                this.loadGraph();
                this.loading = false;
            },
            () => {
               this.loading = false;
            });
        }
    }

    selectDistributorProduct(productId) {
        this.selectedDistributorProduct = productId;
        this.reportForm.get('product').setErrors(null);
    }

    loadCompanies() {
        var _self = this;
        this.reportService.getCompanies()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companies = data['data'];
                var activeCompanies=[];
                for(let i=0; i<this.companies.length; i++){
                    if(this.companies[i].active){
                        activeCompanies.push(this.companies[i])
                    }
                }
                this.companies=activeCompanies;
                $('#companySelect2').select2({
                    width: '100%',
                    disabled: false
                });
                $('#companySelect2').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectCompany(selectId);
                });
            }
            this.loading = false;
        },
        () => {
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
        this.reportService.getBuilding(this.selectedCompany)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companyBuildings = data['data'];
                var activeCompanyBuilding=[];
                for(let i=0; i<this.companyBuildings.length; i++){
                    if(this.companyBuildings[i].active){
                        activeCompanyBuilding.push(this.companyBuildings[i])
                    }
                }
                this.companyBuildings=activeCompanyBuilding;
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
        () => {
             this.loading = false;
        });
    }

    selectCompanyBuilding(companyBuildingId) {
        this.selectedCompanyBuilding = companyBuildingId;
        if (this.selectedProductType.length > 5 && this.selectedCompanyBuilding.length > 5) {
            $('#productSelect2').select2({
                 width: '100%',
                 disabled: false
            });
        this.loadProduct();
        }else {
            $('#productSelect2').select2({
                width: '100%',
                disabled: true
            });
        }
    }

    loadProductTypes() {
        var _self = this;
        this.reportService.getCurrentProductType()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data['data'];
                $('#productType').select2({
                    width: '100%'
                });
                $('#productType').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectProductType(selectId);
                });
            }
            this.loading = false;
        },
        () => {
             this.loading = false;
        });
    }

    selectProductType(productTypeId) {
        this.selectedProductType = productTypeId;
        this.reportForm.get('productType').setErrors(null);
        this.components = this.selectedProductType.components;
        if (this.selectedProductType.length > 5 && this.selectedCompanyBuilding.length > 5) {
            $('#productSelect2').select2({
                 width: '100%',
                 disabled: false
            });
        this.loadProduct();
        }else {
            $('#productSelect2').select2({
                width: '100%',
                disabled: true
            });
        }
    }

    validateForm() {
        if (!this.startDate) {
            this.reportForm.get('startDate').setErrors({'required': true});
            return false;
        }
        if (!this.endDate) {
            this.reportForm.get('endDate').setErrors({'required': true});
            return false;
        }
        if (!this.selectedProductType) {
            this.reportForm.get('productType').setErrors({'required': true});
            return false;
        }
        if(this.selectedCompanyBuilding){
            if (!this.selectedDistributorProduct) {
                this.reportForm.get('product').setErrors({'required': true});
            }
        }
        return true;
    }

    showReportData() {
        this.loadClientVendorReport();
    }

    loadClientVendorReport() {
        if (this.validateForm()) {
            var request: any = {
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate),
                distributorId : this.currentUser.ownerId,
                productTypeId: this.selectedProductType
            };

            request.companyId = this.selectedCompany.length > 0 ? this.selectedCompany:null;

            request.companyBuildingId = this.selectedCompanyBuilding.length > 0 ? this.selectedCompanyBuilding:null;

            request.productId = this.selectedDistributorProduct.length>0 ? this.selectedDistributorProduct:null;
            this.reportService.getClientVendorData(request,this.currentPage,this.pageSize)
            .subscribe(
            data => {
                this.productDatas = data['data'];
                this.paginationItems = this.productDatas;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                let reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                for (let i = 0; i < this.productDatas.length; i++) {
                    this.productDatas[i].longDate = this.productDatas[i].date;
                    this.productDatas[i].date = this.dateService.getDateString(this.productDatas[i].date);
                }
                if (this.productDatas && this.productDatas.length > 0) {
                    this.gridView = true;
                    this.graphView = false;
                    var self = this;
                    setTimeout(function(){
                        self.loadGraph();
                    }, 1000);

                }
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
                this.loading = false;
            });
        }

    }

    downloadProductData(form) {
        if (this.validateForm()) {
            this.loading = true;
            var request: any = {
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate),
                distributorId : this.currentUser.ownerId,
                productTypeId: this.selectedProductType
            };

            request.companyId = this.selectedCompany.length > 0 ? this.selectedCompany:null;

            request.companyBuildingId = this.selectedCompanyBuilding.length > 0 ? this.selectedCompanyBuilding:null;

            request.productId = this.selectedDistributorProduct.length>0 ? this.selectedDistributorProduct:null;

            this.reportService.downloadData(request)
            .subscribe(
            data => {
                this.productDataReport = data['data'];
                $('#downloadDataModal').modal('show');
                this.loading = false;
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
                this.loading = false;
            });
        }else {
            form.submitted = true;
        }
    }

    loadGraph() {
        for (let i = 0; i < this.productDatas.length; i++) {
            this.getChart(this.productDatas[i], 'chart-' + this.productDatas[i].longDate);
        }
        if (this.productDatas.length >  0) {
            this.getColumnBar();
        }
    }

    showDataGraph(productData) {
        this.selectedProductData = productData;
        this.getChart(this.selectedProductData, 'chart-pop-up-modal');
        $('#productDataGraph').modal('show');
    }

    showGraphView() {
        this.graphView = true;
        this.gridView = false;
    }

    showGridView() {
        this.gridView = true;
        this.graphView = false;
    }

    getChart(productData, id) {
        var dataArray = [];
        var selectedComponents=[];
        for (let i = 0; i < productData.components.length; i++) {
            let component = productData.components[i];
            if(component.showInReport && !component.deleted){
                selectedComponents.push(component);
            }
        }
        var total =0;
        for (let i = 0; i < selectedComponents.length; i++) {
            var value = parseInt(productData['component' + selectedComponents[i].sequence]);
            var name = this.getComponentData(productData, selectedComponents[i].sequence);
            if (name != '') {
                dataArray.push({'component': name, 'count': value});
                total+=value;
            }
        }
        if(total == 0){
            dataArray.push({ 'component': 'NA', 'count': 1 });
        }
        var chart = am4core.create(id, am4charts.PieChart);
        chart.data = dataArray;
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'count';
        pieSeries.dataFields.category = 'component';
        pieSeries.slices.template.stroke = am4core.color('#fff');
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.ticks.template.disabled = true;
        pieSeries.labels.template.disabled = true;
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        chart.hiddenState.properties.radius = am4core.percent(0);
    }

    getColumnBar() {
        var dataArray = [];
        var selectedComponents=[];
        for (let i = 0; i < this.productDatas[0].components.length; i++) {
            let component = this.productDatas[0].components[i];
            if(component.showInReport && !component.deleted){
                selectedComponents.push(component);
            }
        }
        for (let j = 0; j < this.productDatas.length; j++) {
            var dataItem = {'date': this.productDatas[j].date};
            for (var i = 0; i < selectedComponents.length ; i++) {
                var value = parseInt(this.productDatas[j]['component' + selectedComponents[i].sequence]);
                var name = this.getComponentData(this.productDatas[j], selectedComponents[i].sequence);
                if (name != '') {
                    dataItem[name] = value;
                }
            }
            dataArray.push(dataItem);
        }
        let self = this;
        var chart = am4core.create('bar-column', am4charts.XYChart);
        chart.data = dataArray;
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'date';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        for (var i = 0; i < selectedComponents.length ; i++) {
            var name = selectedComponents[i].name;
            if (name != '') {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = name;
                series.dataFields.categoryX = 'date';
                series.name = name;
                series.tooltipText = '{name}: [bold]{valueY}[/]';
            }
        }
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
    }

    getComponents(productData, row){
        var selectedComponents=[];
        for (let i = 0; i < productData.components.length; i++) {
            let component = productData.components[i];
            if(component.showInReport && !component.deleted){
                selectedComponents.push(component);
            }
        }
        var rowComponents=[];
        for (let i = (row -1)*5; i < row*5; i++) {
            if(i < selectedComponents.length){
                let component = selectedComponents[i];
                rowComponents.push(component);
            }else{
                let component = {name: '', sequence: i+1}
                rowComponents.push(component);
            }
        }
        return rowComponents;
    }

    getComponentData(productData, index) {
        for (let i = 0; i < productData.components.length; i++) {
            let component = productData.components[i];
            if (component.sequence == index) {
                return component.name;
            }
        }
        return '';
    }

    changePage(event) {
         this.currentPage = event;
         this.loadClientVendorReport();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadClientVendorReport();
    }

    loadClient() {
        this.reportService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'Report List',REPORT_CONSTANTS.URL.REPORT_CLIENT_VENDOR,true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
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
