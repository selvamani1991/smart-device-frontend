import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;
import { DateService } from '../../../shared/services/date.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'ConsumerTotalUsage',
  templateUrl: './consumer-total-usage.component.html',
  styleUrls: [],
})

export class ConsumerTotalUsageComponent {
    loading = false;
    currentUser=undefined;
    consumerProduct=true;
    selectedProductType: any = '';
    selectedComponent: any = '';
    startDate:any='';
    endDate:any='';
    productType: any= {};
    components = [];
    totalUsage = [];
    componentList= [];
    @Input ()productTypes= [];
    @Input ()client: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private mainService: MainService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private router: Router,
                private sweetAlertService: SweetAlertService
    ) {
    this.CONFIG = APP_CONFIG;
    this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );


    }

     ngOnInit() {
        this.initialize();
     }

     initialize(){
        let _self = this;
        $('#startDateConsumerUsageData1').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                console.log(selectedDate);
                this.startDate = selectedDate;
                _self.loadTotalUsage();
             }
        });

        $('#endDateConsumerUsageData1').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                console.log(selectedDate);
                this.endDate = selectedDate;
                _self.loadTotalUsage();
             }
        });

        this.loadProductTypes();
     }

     loadProductTypes() {
         var _self = this;
         this.mainService.getProductTypes()
         .subscribe(
         data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                var activeProductType=[];
                for(let i=0; i<this.productTypes.length; i++){
                    if(this.productTypes[i].active && !this.productTypes[i].deleted  && this.productTypes[i].consumerProduct){
                        activeProductType.push(this.productTypes[i])
                    }
                }
                this.productTypes=activeProductType;
                if(this.productTypes.length> 0){
                    this.selectedProductType=this.productTypes[0].alias;
                    this.components=this.productTypes[0].components;
                    for( var i=0;i< this.components.length ;i++){
                        this.componentList.push(this.components[i].name)
                    }
                    if(this.selectedProductType.length>0){
                        this.initializeComponent();
                        this.loadTotalUsage();
                    }
                }
                $('#selectProductTypeUsageConsumer').select2({
                 width: '100%',
                 disabled: false
                });
                $('#selectProductTypeUsageConsumer').on("select2:select", function (e) {
                    var selectId = e.params.data.id;
                     this.selectedProductType=selectId;
                     _self.selectProductType(selectId);
                     _self.loadTotalUsage();
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
         //console.log(this.productTypes);
         for(var i=0;i<this.productTypes.length;i++ ){
             if(this.productTypes[i].alias == productTypeId){
                 this.selectedProductType = productTypeId;
                 console.log(this.selectedProductType);
                 this.components=this.productTypes[i].components;
                 this.componentList=[];

                 for( var j=0;j < this.components.length ;j++){
                     this.componentList.push(this.components[j].name)
                 }
             }
         }
     }

     initializeComponent(){
         var _self=this;
         $('#selectComponentUsageConsumer').select2({
            width: '100%',
            disabled: false,
            closeOnSelect : true,
            placeholder : "Select Component",
            allowHtml: true,
            allowClear: true,
            tags: true
         });

         $('#selectComponentUsageConsumer').on("select2:select", function (e) {
             var selectId = e.params.data.id;

             _self.selectedComponent= selectId;
             if(_self.componentList.length  == _self.components.length){
                 _self.componentList = [];
             }
             for( var i=0;i< _self.components.length ;i++){
                 if(_self.components[i].id==selectId || selectId == 0){
                     if(!_self.componentList.includes(_self.components[i].name)){
                         _self.componentList.push(_self.components[i].name);
                     }
                 }
             }
             console.log(_self.componentList);
             _self.calculateGraphData();
         })

         $('#selectComponentUsageConsumer').on("select2:unselecting", function (e) {
             var unselected_value = $('#selectComponentUsageConsumer').val();
             if(unselected_value.length == 0 ){
                 _self.componentList=[];
                 for( var i=0;i< _self.components.length ;i++){
                     _self.componentList.push(_self.components[i].name);
                 }
             }else{
                 var selectId = e.params.args.data.id; //your id
                 console.log(selectId);
                 for( var i=0;i< _self.components.length ;i++){
                     if(_self.components[i].id==selectId){
                         for( var j=0;j< _self.componentList.length ;j++){
                             if(_self.components[i].name == _self.componentList[j]){
                                 _self.componentList.splice(j,1);
                                 break;
                             }
                         }
                     }
                 }
                 if(_self.componentList.length == 0){
                     _self.componentList=[];
                     for( var i=0;i< _self.components.length ;i++){
                         _self.componentList.push(_self.components[i].name);
                     }
                 }
             }

             _self.calculateGraphData();
         });
     }

     loadTotalUsage( ) {
             var request: any;
             if(this.currentUser.userType=='clientAdmin'){
                 request = {
                         productTypeId: this.selectedProductType ? this.selectedProductType : null,
                         startDate: this.dateService.getLongFromString(this.startDate),
                         endDate: this.dateService.getLongFromString(this.endDate),
                         consumerProduct: true

                 };
             }

             this.mainService.getTotalUsage(request)
             .subscribe(
             data => {
                 this.totalUsage = data['data'];
                 this.calculateGraphData();

             },
             error => {
                 this.sweetAlertService.notSuccessful(error.message);
                 this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
                 this.loading = false;
             });

     }

     calculateGraphData(){
         let usageData = [];
         for (let i = 0; i < this.totalUsage.length; i++) {
             var dataItem = {};
             dataItem['Month'] = this.totalUsage[i].label;
             var length=this.totalUsage[i].countResponseList.length;
             //length = length > 10 ? 10 : length;
             for (let j = 0; j < length; j++) {
                 //if(this.componentList.includes(this.totalUsage[i].countResponseList[j].label)){
                     dataItem['value'+(j+1)] = this.totalUsage[i].countResponseList[j].count;
                 //}
             }
             usageData.push(dataItem);
         }
          this.getBarChart('total-usage-data-bar-consumer', usageData, this.totalUsage[0].countResponseList);
     }


    getBarChart(lineBar, usageData, objectData ) {

        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = usageData;
        chart.colors.step = 2;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'Month';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.line.strokeOpacity = 1;

        // categoryAxis.renderer.startLocation = 0;
        categoryAxis.renderer.cellStartLocation = 0.3;
        categoryAxis.renderer.cellEndLocation = 0.7;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        var length=objectData.length;
        //length = length > 10 ? 10 : length;

        for (let i = 0; i < length; i++) {
            if(this.componentList.includes(objectData[i].label)){
                let series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.width = am4core.percent(80);
                series1.columns.template.tooltipText = '{name}: {valueY.value}';
                series1.name = objectData[i].label;
                series1.dataFields.categoryX = 'Month';
                series1.dataFields.valueY = 'value'+(i+1);
            }
        }
            chart.legend = new am4charts.Legend();

        }

    showZone() {
        if (this.selectedProductType.length > 0) {
            $('#selectComponentUsageConsumer').select2('disable', false);
        }else {
            $('#selectComponentUsageConsumer').select2('disable', true);
        }
    }


}
