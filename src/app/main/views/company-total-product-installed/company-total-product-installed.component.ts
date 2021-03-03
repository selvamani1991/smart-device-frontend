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
  selector: 'CompanyTotalProductInstalled',
  templateUrl: './company-total-product-installed.component.html',
  styleUrls: [],
})
export class CompanyTotalProductInstalledComponent {
    loading = false;
    selectedZone: any = '';
    currentUser=undefined;
    selectedProductType: any = '';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    startDate:any='';
    endDate:any='';
    totalProductInstalled = [];
    productType: any= {};
    revenueTypes = [];
    productInstalled: any= {};
    productTypes= [];
    zoneCompanies= [];
    @Input ()zones= [];
    @Input ()client: any= {};
    @Input () companies: any= [];
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
        let _self = this;
        setTimeout(function(){
            $('#select2ProductTypeInstalledProductCompany').select2({
               width: '100%'
            });
            $('#select2ProductTypeInstalledProductCompany').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 5) {
                    _self.loadClientProductInstalled();
                }

            });

            $('#selectCompanyBuildingInstalledProductCompany').select2({
               width: '100%',
            });
            $('#selectCompanyBuildingInstalledProductCompany').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompanyBuilding = selectId;
                if (_self.selectedCompanyBuilding.length > 5) {
                    _self.loadClientProductInstalled();
                }
            });
        },1000);

        $('#startDateInstalledProductCompany').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 _self.loadClientProductInstalled();
             }
        });

        $('#endDateInstalledProductCompany').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.endDate = selectedDate;
                 _self.loadClientProductInstalled();
             }
        });

        this.loadProductTypes();
    }

    loadProductTypes() {
        var _self = this;
        this.mainService.getCurrentProductTypeList()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                this.selectedProductType=this.productTypes[0].alias;
                //if(this.selectedProductType.length>0){
                    this.loadClientProductInstalled();
                //}

                $('#select2ProductTypeInstalledProductCompany').select2({
                    width: '100%',
                    disabled: false
                });
                $('#select2ProductTypeInstalledProductCompany').on("select2:select", function (e) {
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

    loadClientProductInstalled( ) {
        var request: any = {
                productTypeId: this.selectedProductType ? this.selectedProductType : null,
                companyBuildingId: this.selectedCompanyBuilding ? this.selectedCompanyBuilding : null,
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate)

        };

        this.mainService.getCompanyProductInstalled(request)
        .subscribe(
        data => {
            this.totalProductInstalled = data['data'];
            this.calculateGraphData();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    calculateGraphData(){
        let productInstalledData = [];
        for (let i = 0; i < this.totalProductInstalled.length; i++) {
            var dataItem = {};
            dataItem['Month'] = this.totalProductInstalled[i].label;
            var length=this.totalProductInstalled[i].countResponseList.length;
            //length = length > 10 ? 10 : length;
            for (let j = 0; j < length; j++) {
                dataItem['value'+(j+1)] = this.totalProductInstalled[i].countResponseList[j].count;
            }
            productInstalledData.push(dataItem);
        }
        console.log(productInstalledData);
        this.getBarChart('installed-product-company', productInstalledData, this.totalProductInstalled[0].countResponseList);
    }

    getBarChart(lineBar, productInstalledData, objectData ) {

            let chart = am4core.create(lineBar, am4charts.XYChart);
            chart.data = productInstalledData;
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
            length = length > 10 ? 10 : length;
            for (let i = 0; i < length; i++) {
                let series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.width = am4core.percent(80);
                series1.columns.template.tooltipText = '{name}: {valueY.value}';
                series1.name = objectData[i].label;
                series1.dataFields.categoryX = 'Month';
                series1.dataFields.valueY = 'value'+(i+1);
            }


            chart.legend = new am4charts.Legend();

           /*  let series2 = chart.series.push(new am4charts.ColumnSeries());
            series2.columns.template.width = am4core.percent(80);
            series2.columns.template.tooltipText = '{name}: {valueY.value}';
            series2.name = 'SalesRevenue';
            series2.dataFields.categoryX = 'Month';
            series2.dataFields.valueY = 'SalesRevenue';

            let series3 = chart.series.push(new am4charts.ColumnSeries());
            series3.columns.template.width = am4core.percent(80);
            series3.columns.template.tooltipText = '{name}: {valueY.value}';
            series3.name = 'SubscriptionRevenue';
            series3.dataFields.categoryX = 'Month';
            series3.dataFields.valueY = 'SubscriptionRevenue'; */

    }

    /*showZone() {
        if (this.selectedProductType.length > 0) {
            $('#selectZoneInstalledProduct').select2('disable', false);
        }else {
            $('#selectZoneInstalledProduct').select2('disable', true);
        }
    }*/

    showCompany() {
        if (this.selectedZone.length > 0) {
            $('#selectCompanyInstalledProduct').select2('disable', false);
        }else {
            $('#selectCompanyInstalledProduct').select2('disable', true);
        }

    }

}
