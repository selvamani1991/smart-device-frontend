import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;


@Component({
  selector: 'ClientRevenueCategory',
  templateUrl: './client-revenue-category.component.html',
  styleUrls: [],
})
export class ClientRevenueCategoryComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    alias:any;
    currentUser=undefined;
    productRevenue: any= {};
    product: any= {};
    @Input () zones= [];
    @Input () client: any= {};
    @Input () vendor: any= {};
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
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
            $('#selectRevenueCategory').select2({
               width: '100%'
            });
            $('#selectRevenueCategory').on('select2:select', function(e){
               let selectId = e.params.data.id;
               _self.selectedZone = selectId;
               if (_self.selectedZone.length > 5) {
                    _self.loadZoneWiseRevenue();
               }

            });
        },500);

        this.loadZoneWiseRevenue();

    }

    loadZoneWiseRevenue() {
        this.mainService.getProductRevenueReport(this.selectedZone ? this.selectedZone : '')
        .subscribe(
        data => {
            this.productRevenue = data['data'][0];
            let productRevenueData = [];
            if (this.productRevenue) {
                productRevenueData.push({
                    'component': 'Production',
                    'number': this.productRevenue.productionRevenue,
                    });
                productRevenueData.push({
                    'component': 'Subscription',
                    'number': this.productRevenue.subscriptionRevenue,
                    });
                productRevenueData.push({
                    'component': 'Sales',
                    'number': this.productRevenue.salesRevenue,
                    });
            }else {
                productRevenueData.push({
                     'component': 'N/A',
                     'number': 1,
                });
            }

            if (this.productRevenue && !this.productRevenue.productionRevenue && !this.productRevenue.salesRevenue && !this.productRevenue.subscriptionRevenue) {
               productRevenueData.push({
                    'component': 'N/A',
                    'number': 1,
               });
            }

            this.getRevenuePieChart('revenue_detail', productRevenueData);
        },
        () => {
            this.loading = false;
        });
    }

    getRevenuePieChart(revenue_detail, productRevenueData) {
         // Create chart instance
         let chart = am4core.create(revenue_detail, am4charts.PieChart);

         // Add data
         chart.data = productRevenueData;

         // Add and configure Series
         let pieSeries = chart.series.push(new am4charts.PieSeries());
         pieSeries.dataFields.value = 'number';
         pieSeries.dataFields.category = 'component';
         pieSeries.slices.template.stroke = am4core.color('#fff');
         pieSeries.slices.template.strokeOpacity = 1;

         // This creates initial animation
         pieSeries.hiddenState.properties.opacity = 1;
         pieSeries.hiddenState.properties.endAngle = -90;
         pieSeries.hiddenState.properties.startAngle = -90;

         chart.hiddenState.properties.radius = am4core.percent(0);
         chart.legend = new am4charts.Legend();
    }

}
