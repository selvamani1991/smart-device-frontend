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
  selector: 'CompanyTotalErrorData',
  templateUrl: './company-total-error-data.component.html',
  styleUrls: [],
})
export class CompanyTotalErrorDataComponent {
    loading = false;
    selectedZone: any = '';
    currentUser=undefined;
    selectedProductType: any = '';
    selectedComponent: any = '';
    selectedErrorData: any = '';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    startDate:any='';
    endDate:any='';
    productType: any= {};
    revenueTypes = [];
    deviceErrors = [];
    totalError = [];
    errorList= [];
    productTypeRevenue: any= {};
    productTypes= [];
    zoneCompanies: any = [];
    @Input ()zones= [];
    @Input ()client: any= {};
    @Input () companyBuildings: any= [];
     @Input () company: any= [];
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
        setTimeout(function(){
            $('#selectCompanyBuildingDataCompany').select2({
                width: '100%',
            });
            $('#selectCompanyBuildingDataCompany').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompanyBuilding = selectId;
                if (_self.selectedCompanyBuilding.length > 0) {
                    _self.loadTotalErrorData();
                }
                });
        },1000);

        $('#startDateErrorDataCompany').datepicker({
              changeMonth: true,
              changeYear: true,
              dateFormat: 'dd/mm/yy',
              onSelect: (selectedDate) => {
                  this.startDate = selectedDate;
                  _self.loadTotalErrorData();
              }
        });

         $('#endDateErrorDataCompany').datepicker({
              changeMonth: true,
              changeYear: true,
              dateFormat: 'dd/mm/yy',
              onSelect: (selectedDate) => {
                  this.endDate = selectedDate;
                  _self.loadTotalErrorData();
              }
         });

         this.loadProductTypes();
    }

    loadProductTypes() {
        var _self = this;
        this.mainService.getCompanyProductTypes()
        //this.mainService.getProductTypeForGraph()
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
                if(this.productTypes.length> 0){
                    this.selectedProductType=this.productTypes[0].alias;
                    this.deviceErrors=this.productTypes[0].deviceErrors;
                    for( var i=0;i< this.deviceErrors.length ;i++){
                        this.errorList.push(this.deviceErrors[i].name)
                    }
                    if(this.selectedProductType.length>0){
                        this.initializeComponent();
                        this.loadTotalErrorData();
                    }
                }
                setTimeout(function(){
                    $('#selectProductTypeDataCompany').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#selectProductTypeDataCompany').on("select2:select", function (e) {
                        var selectId = e.params.data.id;
                        this.selectedProductType=selectId;
                        _self.selectProductType(selectId);
                        _self.loadTotalErrorData();
                    })
                },1000);
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
                this.deviceErrors=this.productTypes[i].deviceErrors;
                this.errorList=[];

                for( var i=0;i< this.deviceErrors.length ;i++){
                    this.errorList.push(this.deviceErrors[i].name)
                }

            }
        }
    }

    initializeComponent(){
        var _self=this;
        setTimeout(function(){
        $('#selectErrorDataCompany').select2({
           width: '100%',
           disabled: false,
           closeOnSelect : true,
           placeholder : "Select Error Data",
           allowHtml: true,
           allowClear: true,
           tags: true
        });

        $('#selectErrorDataCompany').on("select2:select", function (e) {
            var selectId = e.params.data.id;

            _self.selectedErrorData= selectId;
            if(_self.errorList.length  == _self.deviceErrors.length){
                _self.errorList = [];
            }
            for( var i=0;i< _self.deviceErrors.length ;i++){
                if(_self.deviceErrors[i].id==selectId || selectId == 0){
                    if(!_self.errorList.includes(_self.deviceErrors[i].name)){
                        _self.errorList.push(_self.deviceErrors[i].name);
                    }

                }
            }
            console.log(_self.errorList);
            _self.calculateGraphData();
        });
        },500);

        $('#selectErrorDataCompany').on("select2:unselecting", function (e) {
            var unselected_value = $('#selectErrorDataCompany').val();
            console.log(unselected_value);
            if(unselected_value.length == 0 ){
                _self.errorList=[];
                for( var i=0;i< _self.deviceErrors.length ;i++){
                    _self.errorList.push(_self.deviceErrors[i].name);
                }
            }else{
            var selectId = e.params.args.data.id; //your id
            for( var i=0;i< _self.deviceErrors.length ;i++){
                if(_self.deviceErrors[i].id==selectId){
                    for( var j=0;j< _self.errorList.length ;j++){
                        if(_self.deviceErrors[i].name == _self.errorList[j]){
                            _self.errorList.splice(j,1);
                            break;
                        }
                    }
                }
            }
            if(_self.errorList.length == 0){
                _self.errorList=[];
                for( var i=0;i< _self.deviceErrors.length ;i++){
                    _self.errorList.push(_self.deviceErrors[i].name);
                }
                }
            }

                _self.calculateGraphData();
            });
        }

    calculateGraphData(){
        let companyErrorData = [];
        for (let i = 0; i < this.totalError.length; i++) {
            var dataItem = {};
            dataItem['Month'] = this.totalError[i].label;
            var length=this.totalError[i].countResponseList.length;
            //length = length > 10 ? 10 : length;
            for (let j = 0; j < length; j++) {
                //if(this.errorList.includes(this.totalError[i].countResponseList[j].label)){
                    dataItem['value'+(j+1)] = this.totalError[i].countResponseList[j].count;
                //}
            }
            companyErrorData.push(dataItem);
        }
        this.getBarChart('total-error-data-bar-company', companyErrorData, this.totalError[0].countResponseList);
    }

    loadTotalErrorData( ) {
        var request: any = {
                productTypeId: this.selectedProductType ? this.selectedProductType: null,
                companyBuildingId: this.selectedCompanyBuilding && this.selectedCompanyBuilding.length >5 ? this.selectedCompanyBuilding  : null,
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate)

        };

        this.mainService.getCompanyTotalErrorData(request)
            .subscribe(
            data => {
                this.totalError = data['data'];
                this.calculateGraphData();

            },
            error => {
                this.sweetAlertService.notSuccessful(error.message);
                this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
                this.loading = false;
            });
    }
    getBarChart(lineBar, companyErrorData, objectData ) {

            let chart = am4core.create(lineBar, am4charts.XYChart);
            chart.data = companyErrorData;
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
                if(this.errorList.includes(objectData[i].label)){
                    let series1 = chart.series.push(new am4charts.ColumnSeries());
                    series1.columns.template.width = am4core.percent(80);
                    series1.columns.template.tooltipText = '{name}: {valueY.value}';
                    series1.name = objectData[i].label;
                    console.log(series1.name );
                    series1.dataFields.categoryX = 'Month';
                    series1.dataFields.valueY = 'value'+(i+1);
                }
            }


            chart.legend = new am4charts.Legend();

    }



}