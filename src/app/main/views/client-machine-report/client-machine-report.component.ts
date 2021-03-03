import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;


@Component({
  selector: 'ClientMachineReport',
  templateUrl: './client-machine-report.component.html',
  styleUrls: [],
})
export class ClientMachineReportComponent {
    loading = false;
    selectedZone: any = '';
    currentUser=undefined;
    selectedProductType: any = '';
    productType: any= {};
    productTypeRevenue: any= {};
    @Input ()productTypes= [];
    @Input ()zones= [];
    @Input ()client: any= {};
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
            $('#selectMachineProductTypeZoneProduct').select2({
               width: '100%'
            });

            $('#selectMachineProductTypeZoneProduct').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                    _self.loadProductTypeRevenue();
                }
            });
        },500);
        $('#selectMachineProductTypeProduct').select2({
           width: '100%'
        });

        $('#selectMachineProductTypeProduct').on('select2:select', function(e){
            let selectId = e.params.data.id;
            _self.selectedProductType = selectId;
            if (_self.selectedProductType.length > 5) {
                _self.loadProductTypeRevenue();
            }
        });
        this.loadProductTypeRevenue();
    }
     loadProductTypeRevenue( ) {
        this.mainService.getProductTypeWiseRevenue(this.selectedZone ? this.selectedZone : '', this.selectedProductType ? this.selectedProductType : '')
            .subscribe(
            data => {
                let productTypeRevenue = data['data'];
                let productTypeBarData = [];
                for (let i = 0; i < productTypeRevenue.length; i++) {
                    productTypeBarData.push({'Month': productTypeRevenue[i].category, 'ProductionRevenue': productTypeRevenue[i].value2, 'SalesRevenue': productTypeRevenue[i].value1, 'SubscriptionRevenue': productTypeRevenue[i].value3});
                }
                this.getBarChart('productTypeZoneBar', productTypeBarData);
            },
            () => {
                this.loading = false;
            });
     }
    getBarChart(lineBar, productTypeBarData) {

    let chart = am4core.create(lineBar, am4charts.XYChart);
    chart.data = productTypeBarData;
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
