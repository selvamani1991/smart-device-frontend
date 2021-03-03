import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'ClientCompanyReport',
  templateUrl: './client-company-report.component.html',
  styleUrls: [],
})
export class ClientCompanyReportComponent {
    loading = false;
    selectedZone: any = '';
    selectedCompany: any = '';
    company: any= {};
    companies= [];
    currentUser=undefined;
    companyRevenueData: any= {};
    @Input () client: any= {};
    @Input () zones= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private mainService: MainService,private authenticationService: AuthenticationService) {
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
            $('#zoneWiseCompanyReportZone').select2({
               width: '100%'
            });
            $('#zoneWiseCompanyReportZone').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                   _self.loadTopCompany();
                }
            });
        },500);
        setTimeout(function(){
            $('#zoneWiseCompanyReportCompany').select2({
               width: '100%'
            });
            $('#zoneWiseCompanyReportCompany').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompany = selectId;
                if (_self.selectedCompany.length > 5) {
                   _self.loadTopCompany();
                }
            });
        },500);
        this.loadTopCompany();
        this.loadCompany();

    }

    loadCompany() {
        this.mainService.getCompanies()
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
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectCompany(companyId) {
        for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].id === companyId) {
                this.selectedCompany = this.companies[i];
            }
        }
    }

    loadTopCompany( ) {
        this.mainService.getProductTypeWiseCompanyRevenue(this.selectedZone ? this.selectedZone : '', this.selectedCompany ? this.selectedCompany : '')
        .subscribe(
            data => {
                let companyRevenueData = data['data'];
                let companyBarData = [];
                for (let i = 0; i < companyRevenueData.length; i++) {
                    companyBarData.push({'Month': companyRevenueData[i].category, 'ProductionRevenue': companyRevenueData[i].value1, 'SalesRevenue': companyRevenueData[i].value2, 'SubscriptionRevenue': companyRevenueData[i].value3});
                }
                this.getBarChart('companyZoneBar', companyBarData);
            },
            () => {
                this.loading = false;
            });
    }

    getBarChart(lineBar, companyRevenueData) {

        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = companyRevenueData;
        chart.colors.step = 2;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'Month';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.line.strokeOpacity = 1;

        // categoryAxis.renderer.startLocation = 0;
        categoryAxis.renderer.cellStartLocation = 0.3;
        categoryAxis.renderer.cellEndLocation = 0.7;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        let series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(80);
        series1.columns.template.tooltipText = '{name}: {valueY.value}';
        series1.name = 'ProductionRevenue';
        series1.dataFields.categoryX = 'Month';
        series1.dataFields.valueY = 'ProductionRevenue';

        let series2 = chart.series.push(new am4charts.ColumnSeries());
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
        series3.dataFields.valueY = 'SubscriptionRevenue';


    }

}
