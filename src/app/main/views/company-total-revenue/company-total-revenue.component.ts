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
  selector: 'CompanyTotalRevenue',
  templateUrl: './company-total-revenue.component.html',
  styleUrls: [],
})
export class CompanyTotalRevenueComponent {
    loading = false;
    selectedZone: any = '';
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
            $('#selectProductTypeTotalRevenueCompanyAdmin').select2({
               width: '100%'
            });

            $('#selectProductTypeTotalRevenueCompanyAdmin').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                //if (_self.selectedProductType.length > 5) {
                    _self.loadTotalRevenue();
                //}

            });
            $('#selectCompanyBuildingTotalRevenueCompanyAdmin').select2({
                width: '100%'
            });
            $('#selectCompanyBuildingTotalRevenueCompanyAdmin').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompanyBuilding = selectId;
                //if (_self.selectedCompanyBuilding.length > 5) {
                    _self.loadTotalRevenue();
                //}
            });
        },1000);

        $('#startDateRevenueCompanyAdmin').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 _self.loadTotalRevenue();
             }
        });

        $('#endDateRevenueCompanyAdmin').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.endDate = selectedDate;
                 _self.loadTotalRevenue();
             }
        });

        $('#revenueTypeDropdownCompanyAdmin').select2({
            width: '100%'
        });
        setTimeout(function(){
            $('#revenueTypeDropdownCompanyAdmin').on("select2:select",function(e){
                var selectId = e.params.data.id;
                _self.selectedRevenueType=selectId;
                _self.loadTotalRevenue();
            });
        },1000)


        this.loadProductTypes();
    }



    loadTotalRevenue( ) {
        var request: any = {
                productTypeId: this.selectedProductType ? this.selectedProductType : null,
                companyBuildingId: this.selectedCompanyBuilding ? this.selectedCompanyBuilding : null,
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate)

        };
        this.mainService.getCompanyTotalRevenue(request)
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
            this.getBarChart('total-revenue-company-admin', revenueData, totalRevenue[0].amountResponseList);
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
        this.mainService.getCurrentProductType()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                this.selectedProductType=this.productTypes[0].alias;
                //if(this.selectedProductType.length>0){
                    this.loadTotalRevenue();
                //}
                $('#selectProductTypeTotalRevenueCompanyAdmin').select2({
                    width: '100%',
                    disabled: false
                });
                $('#selectProductTypeTotalRevenueCompanyAdmin').on("select2:select", function (e) {
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
