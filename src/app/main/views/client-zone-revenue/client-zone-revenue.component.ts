import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'ClientZoneRevenue',
  templateUrl: './client-zone-revenue.component.html',
  styleUrls: [],
})

export class ClientZoneRevenueComponent {
    loading = false;
    selectedZone: any = '';
    currentUser=undefined;
    zone: any= {};
    @Input () zones= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private router: Router,
                private mainService: MainService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        var _self = this;
        setTimeout(function(){
            $('#selectRevenueZone').select2({
               width: '100%'
            });
            $('#selectRevenueZone').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                   _self.loadZoneRevenue();
                }
            });
        },500);
        this.loadZoneRevenue();

    }

    loadZoneRevenue( ) {
        this.mainService.getZoneWiseRevenue(this.selectedZone ? this.selectedZone : '')
        .subscribe(
        data => {
            let zoneRevenue = data['data'];
            let zoneData = [];
            for (let i = 0; i < zoneRevenue.length; i++) {
                zoneData.push(
                    {
                    'Month': zoneRevenue[i].category,
                    'ProductionRevenue': zoneRevenue[i].value2,
                    'SalesRevenue': zoneRevenue[i].value1, 
                    'SubscriptionRevenue': zoneRevenue[i].value3
                });
            }
            this.getBarChart('zone-revenue-bar', zoneData);
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    getBarChart(lineBar, zoneData) {

        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = zoneData;
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
