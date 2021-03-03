import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'ClientVendorProduct',
  templateUrl: './client-vendor-product.component.html',
  styleUrls: [],
})

export class ClientVendorProductComponent {
    loading = false;
    selectedZone= '';
    selectedVendor= '';
    currentUser=undefined;
    vendor: any= {};
    vendorRevenueData: any= {};
    vendors= [];
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
            $('#selectZoneVendor').select2({
               width: '100%'
            });

            $('#selectZoneVendor').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                    _self.loadTopVendors();
                }
            });
        },500);
        setTimeout(function(){
            $('#selectZoneVendorProduct').select2({
               width: '100%'
            });

            $('#selectZoneVendorProduct').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedVendor = selectId;
                if (_self.selectedVendor.length > 5) {
                    _self.loadTopVendors();
                }
            });
        },500);
        this.loadVendors();
        this.loadTopVendors();
     }
     loadVendors() {
         this.mainService.getVendors()
         .subscribe(
         data => {
             if (!data['hasError']) {
                 this.vendors = data['data'];
                 var activeVendors=[];
                 for(let i=0; i<this.vendors.length; i++){
                      if(this.vendors[i].active){
                          activeVendors.push(this.vendors[i])
                      }
                 }
                 this.vendors=activeVendors;
             }
             this.loading = false;
         },
         () => {
             this.loading = false;
         });
     }

     selectVendor(vendorId) {
         for (let i = 0; i < this.vendors.length; i++) {
             if (this.vendors[i].id === vendorId) {
                 this.selectedVendor = this.vendors[i];
             }
         }
     }

     loadTopVendors( ) {
        this.mainService.getProductTypeWiseVendorRevenue(this.selectedZone ? this.selectedZone : '', this.selectedVendor ? this.selectedVendor : '')
         .subscribe(
         data => {
              let vendorRevenueData = data['data'];
              let vendorBarData = [];
              for (let i = 0; i < vendorRevenueData.length; i++) {
                  vendorBarData.push({'Month': vendorRevenueData[i].category, 'ProductionRevenue': vendorRevenueData[i].value1, 'SalesRevenue': vendorRevenueData[i].value2, 'SubscriptionRevenue': vendorRevenueData[i].value3});
              }
              this.getBarChart('vendorZoneBar', vendorBarData);
         },
         () => {
                this.loading = false;
         });
     }


    getBarChart(lineBar, vendorRevenueData) {

       let chart = am4core.create(lineBar, am4charts.XYChart);
       chart.data = vendorRevenueData;
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
