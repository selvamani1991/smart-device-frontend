import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'VendorMachineSale',
  templateUrl: './vendor-machine-sale.component.html',
  styleUrls: [],
})
export class VendorMachineSaleComponent {
    loading = false;
    product: any= {};
    machineSale: any= {};
    selectedProductType: any = '';
    steps: any= [];
    @Input () productTypes = {};
    @Input () client = {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

    ngOnInit() {
        let _self = this;
        setTimeout(function(){
            $('#allProduct').select2({
               width: '100%'
            });
            $('#allProduct').on('select2:select', function(e){
                let selectId = e.params.data.id;
                 _self.selectedProductType = selectId;
                 if (_self.selectedProductType.length > 5) {
                    _self.loadProduct();
                 }

            });
        },1000);
        this.loadProduct();
    }

    loadProduct() {
        this.mainService.getProductSalesRevenue(this.selectedProductType?this.selectedProductType:'')
        .subscribe(
        data => {
            this.machineSale = data['data'][0];
            let machineSaleData = [];
            if (this.machineSale) {
                machineSaleData.push({
                    'component': 'Product Type',
                    'number': this.machineSale.productionRevenue,
                    });
                machineSaleData.push({
                    'component': 'Product',
                    'number': this.machineSale.subscriptionRevenue,
                    });
            }else {
                machineSaleData.push({
                     'component': 'N/A',
                     'number': 1,
                });
            }

            if (this.machineSale && !this.machineSale.productType && !this.machineSale.product ) {
               machineSaleData.push({
                    'component': 'N/A',
                    'number': 1,
               });
            }

            this.getZonalPieChart('zonal_product', machineSaleData);
        },
        () => {
            this.loading = false;
        });
    }

    getZonalPieChart(zonal_product, machineSaleData) {
        // Create chart instance
        let chart = am4core.create(zonal_product, am4charts.PieChart);

        // Add data
        chart.data = machineSaleData;

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
