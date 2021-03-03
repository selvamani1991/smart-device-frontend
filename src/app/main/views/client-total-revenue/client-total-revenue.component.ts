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
  selector: 'ClientTotalRevenue',
  templateUrl: './client-total-revenue.component.html',
  styleUrls: [],
})
export class ClientTotalRevenueComponent {
    loading = false;
    selectedZone: any = '';
    consumerProduct=true;
    currentUser=undefined;
    selectedProductType: any = '';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    startDate:any='';
    endDate:any='';
    productType: any= {};
    revenueTypes = [];
    productTypeRevenue: any= {};
    productTypes= [];
    zoneCompanies= [];
    selectedRevenueType="0";
    @Input ()zones= [];
    @Input ()client: any= {};
    @Input () companies: any= [];
    @Input () companyBuildings: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
        private mainService: MainService,
        private authenticationService: AuthenticationService,
        private dateService: DateService,
        private router: Router,
        private sweetAlertService: SweetAlertService
    ){
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

        this.revenueTypes=[
            {'id':'productionRevenue','name':'ProductionRevenue'},
            {'id':'salesRevenue','name':"SalesRevenue"},
            {'id':'subscriptionRevenue','name':"SubscriptionRevenue"}
        ];

    }

    ngOnInit() {
        let _self = this;
        setTimeout(function(){
            $('#selectZoneTotalRevenue').select2({
               width: '100%',
               disabled: false
            });

            $('#selectZoneTotalRevenue').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                    $('#selectCompanyTotalRevenue').select2({
                        width: '100%',
                        disabled: false
                    });
                    _self.loadTotalRevenue();
                }else {
                    $('#selectCompanyTotalRevenue').select2({
                        width: '100%',
                        disabled: true
                    });
                }
                _self.zoneCompanies = [];
                for (let i = 0; i < _self.companies.length; i++) {
                    if (_self.selectedZone == _self.companies[i].zoneId) {
                        _self.zoneCompanies.push(_self.companies[i]);
                    }
                    if (_self.selectedZone == 0) {
                        _self.zoneCompanies.push(_self.companies[i]);
                    }
                }
            });
        },1000);
        setTimeout(function(){
            $('#selectProductTypeTotalRevenue').select2({
               width: '100%'
            });


            $('#selectProductTypeTotalRevenue').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                _self.loadTotalRevenue();
            });
        },1000);
        if(this.currentUser.userType=='clientAdmin'){
            setTimeout(function(){
                $('#selectCompanyTotalRevenue').select2({
                    width: '100%',
                    disabled: true
                });
                $('#selectCompanyTotalRevenue').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectedCompany = selectId;
                    _self.loadTotalRevenue();
                });
            },1000);
        }


        $('#startDateRevenue').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 _self.loadTotalRevenue();
             }
        });

        $('#endDateRevenue').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.endDate = selectedDate;
                 _self.loadTotalRevenue();
             }
        });

        $('#revenueTypeDropdown').select2({
            width: '100%'
        });
        setTimeout(function(){
            $('#revenueTypeDropdown').on("select2:select",function(e){
                var selectId = e.params.data.id;
                _self.selectedRevenueType=selectId;
                _self.loadTotalRevenue();
            });
        },1000)


        this.loadProductTypes();
    }



    loadTotalRevenue( ) {
        var request: any;
        if(this.currentUser.userType=='clientAdmin'){
            request = {
                    zoneId: this.selectedZone  && this.selectedZone.length >5 ? this.selectedZone : null,
                    productTypeId: this.selectedProductType.length >5 ? this.selectedProductType : null,
                    companyId: this.selectedCompany && this.selectedCompany.length >5 ? this.selectedCompany : null,
                    startDate: this.dateService.getLongFromString(this.startDate),
                    endDate: this.dateService.getLongFromString(this.endDate),
                    revenueType:this.selectedRevenueType != "0"?this.selectedRevenueType:null

            };
        }

        /*if(this.currentUser.userType=='companyAdmin'){
             request = {
                    productTypeId: this.selectedProductType.length >5 ? this.selectedProductType : null,
                    companyBuildingId: this.selectedCompanyBuilding && this.selectedCompanyBuilding.length >5  ? this.selectedCompanyBuilding : null,
                    startDate: this.dateService.getLongFromString(this.startDate),
                    endDate: this.dateService.getLongFromString(this.endDate)
            };
        }*/

        this.mainService.getClientTotalRevenue(request)
        .subscribe(
        data => {
            let totalRevenue = data['data'];
            let revenueData = [];
            for (let i = 0; i < totalRevenue.length; i++) {
                var dataItem = {};
                dataItem['Month'] = totalRevenue[i].label;
                for (let j = 0; j < totalRevenue[i].amountResponseList.length; j++) {
                    dataItem['value'+(j+1)] = totalRevenue[i].amountResponseList[j].count;
                }
                revenueData.push(dataItem);
            }
            if(totalRevenue.length > 0){
                this.getBarChart('total-revenue', revenueData, totalRevenue[0].amountResponseList);
            }
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    getBarChart(lineBar, revenueData, objectData ) {
        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = revenueData;
        chart.colors.step = 2;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'Month';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.line.strokeOpacity = 1;

        // categoryAxis.renderer.startLocation = 0;
        categoryAxis.renderer.cellStartLocation = 0.3;
        categoryAxis.renderer.cellEndLocation = 0.7;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        for (let i = 0; i < objectData.length; i++) {
            let series1 = chart.series.push(new am4charts.ColumnSeries());
            series1.columns.template.width = am4core.percent(80);
            series1.columns.template.tooltipText = '{name}: {valueY.value}';
            series1.name = objectData[i].label;
            series1.dataFields.categoryX = 'Month';
            series1.dataFields.valueY = 'value'+(i+1);
        }


        chart.legend = new am4charts.Legend();
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
                        if(this.productTypes[i].active && !this.productTypes[i].deleted && !this.productTypes[i].consumerProduct){
                            activeProductType.push(this.productTypes[i])
                        }
                    }
                    this.loadTotalRevenue();

                    //this.selectedProductType=this.productTypes[0].alias;
                    //if(this.selectedProductType.length>0){
                    //}

                    this.productTypes=activeProductType;
                    $('#selectProductTypeTotalRevenue').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#selectProductTypeTotalRevenue').on("select2:select", function (e) {
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
            }
        }

    }

}
