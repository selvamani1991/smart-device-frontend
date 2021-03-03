import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_CONSTANTS } from '../../constants';
import { PRODUCT_VALIDATOR } from '../../validator';

import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { ProductService } from '../../services/product.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
am4core.useTheme(am4themes_animated);
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'product-data-list.component.html'
})

export class ProductDataListComponent implements OnInit {
    alias: any= {};
    productDataReport= '';
    form: any= {};
    client: any= {};
    currentUser=undefined;
    startDate= undefined;
    endDate= undefined;
    product: any= {};
    component: any= {};
    productData: any= {};
    consumerDevice: any= {};
    productDatas= [];
    selectedProductData= {};
    loading = false;
    gridView= true;
    graphView= false;
    dateForm: FormGroup;
    showInReport=true;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    PRODUCT_VALIDATOR= PRODUCT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    components= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: PRODUCT_CONSTANTS.LABEL.PRODUCT,
        pageTitle: PRODUCT_CONSTANTS.LABEL.PRODUCT_DATA_LIST,
        pageDesc: PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.PRODUCT_VALIDATOR = PRODUCT_VALIDATOR;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT_DATA_LIST);
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
        this.dateForm = this.createDateForm();
        $('#startDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.startDate = selectedDate;
                this.dateForm.get('startDate').setErrors(null);
            }
        });
        $('#endDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.endDate = selectedDate;
                this.dateForm.get('endDate').setErrors(null);
            }
        });
        this.loadClient();
    }

    createDateForm(): FormGroup {
        return this.dateForm = this._formBuilder.group({
            startDate  : ['', [Validators.required]],
            endDate    : ['', [Validators.required]]
        });
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

    loadProduct() {
        this.productService.getProduct(this.alias)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.product = data['data'][0];
                this.gridView = true;
                this.graphView = false;
                this.loadGraph();
                if(this.currentUser.userType!='SuperAdmin'){
                    this.breadCrumService.pushStep(this.client.productNickName + ' ' + 'List', PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST_ALIAS.replace(":alias",this.product.productType.alias),true);
                }
                if(this.currentUser.userType=='SuperAdmin'){
                    this.breadCrumService.pushStep(PRODUCT_CONSTANTS.LABEL.PRODUCT_LIST_LINK, CONSUMER_CONSTANTS.URL.CONSUMER_DEVICE_LIST_ALIAS.replace(":alias",this.consumerDevice.product.alias),true);
                }
                this.breadCrumService.pushStep(this.client.productNickName + ' ' +'Data'+ ' ' + 'List', PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST, false);
                this.steps = this.breadCrumService.getSteps();

            }

            if (this.product.productType) {
                this.components = this.product.productType.components;
                var validComponents =[];
                for( var i=0;i< this.components.length ;i++){
                    if(this.components[i].showInReport){
                       validComponents.push(this.components[i]);

                    }
                }
                this.components = validComponents;
            }

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_LIST]);
            this.loading = false;
        });
    }

    loadGraph() {
        for (let i = 0; i < this.productDatas.length; i++) {
            this.getChart(this.productDatas[i], 'chart-' + this.productDatas[i].longDate);
        }
        if (this.productDatas.length >  0) {
            this.getColumnBar(this.productData);
        }
    }

    showProductData() {
        this.loadProductDataByProductId();
        this.loadProduct();
    }

    changePage(event) {
        this.currentPage = event;
        this.loadProductDataByProductId();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadProductDataByProductId();
    }
    getComponents(row){
        var rowComponents=[];
        if (this.product.productType) {
            for (let i = (row -1)*5; i < row*5; i++) {
                if(i < this.components.length){
                    let component = this.components[i];
                    rowComponents.push(component);
                }else{
                    let component = {name: '', sequence: i+1}
                    rowComponents.push(component);
                }
            }
        }
        return rowComponents;
    }

    getComponentData(productData,index) {
        if (this.product.productType) {
            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                if (component.sequence == index) {
                    return component.name;
                }
            }
        }
        return '';
    }


    getChart(productData, id) {
        let dataArray = [];

        for (let i = 1; i <= 25; i++) {
            let value = parseInt(productData['component' + i]);
            let name = this.getComponentData(productData,i);
            if (name !== '') {
                dataArray.push({'component': name, 'count': value});
            }
        }

        let chart = am4core.create(id, am4charts.PieChart);
        chart.data = dataArray;
        let pieSeries = chart.series.push(new am4charts.PieSeries());
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

    showGridView() {
        this.gridView = true;
        this.graphView = false;
    }

    showGraphView() {
        this.graphView = true;
        this.gridView = false;
    }

    showDataGraph(productData) {
        this.selectedProductData = productData;
        this.getChart(this.selectedProductData, 'chart-pop-up-modal');
        $('#productDataGraph').modal('show');
    }

    getColumnBar(productData) {
        var dataArray = [];
        for (var j = 0; j < this.productDatas.length; j++) {
        var dataItem = {'date': this.productDatas[j].date};
            for (var i = 1; i <= 25; i++) {
                var value = parseInt(this.productDatas[j]['component' + i]);
                var name = this.getComponentData(productData,i);
                if (name !== '') {
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
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        categoryAxis.dataFields.category = 'date';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        for (var i = 1; i <= 25; i++) {
            var name = self.getComponentData(productData,i);
            if (name !== '') {
                let series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = name;
                series.dataFields.categoryX = 'date';
                series.name = name;
                series.tooltipText = '{name}: [bold]{valueY}[/]';
            }
        }
        chart.cursor = new am4charts.XYCursor();
    }

    validateForm() {
        if (!this.startDate) {
            this.dateForm.get('startDate').setErrors({'required': true});
            return false;
        }
        if (!this.endDate) {
            this.dateForm.get('endDate').setErrors({'required': true});
            return false;
        }
        return true;
    }

    downloadProductData(form) {
        if (this.validateForm()) {
            let request: any = {
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate),
                productId: this.product.alias
            };
            this.loading = true;
            this.productService.downloadProductData(request)
            .subscribe(
            data => {
                this.productDataReport = data['data'];
                $('#downloadDataModal').modal('show');
                this.loading = false;
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_DATA_LIST]);
                this.loading = false;
            });
        } else {
            form.submitted = true;
        }
    }


    loadProductDataByProductId() {
        $('body').addClass('loading');
        if (this.validateForm()) {
            am4core.disposeAllCharts();
            this.loading = true;
            var request: any = {
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate),
                productId: this.product.alias
            };
            this.productService.getProductDataByProduct(request,this.currentPage,this.pageSize)
            .subscribe(
            data => {
                $('body').removeClass('loading');
                console.log(this.productDatas);
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
                if (this.productDatas && this.productDatas.length > 0 ) {
                    this.gridView = true;
                    this.graphView = false;
                    var self = this;
                    setTimeout(function(){
                        self.loadGraph();
                    }, 1000);
                }
            },

            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_PRODUCT_DATA_LIST]);
                this.loading = false;
            });
        }
    }
}
