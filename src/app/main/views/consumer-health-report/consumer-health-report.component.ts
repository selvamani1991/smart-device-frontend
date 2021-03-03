import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'ConsumerHealthReport',
  templateUrl: './consumer-health-report.component.html',
  styleUrls: [],
})
export class ConsumerHealthReportComponent {
    loading = false;
    product: any= {};
    productReport: any= {};
    @Input () client: any= {};
    @Input () company: any= {};
    @Input () vendor: any= {};
    @Input () productTypes= [];
    selectedProductType: any = '';
    productType: any= {};
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
            $('#consumerHealthReportSelect2').select2({
                width: '100%'
            });
            $('#consumerHealthReportSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 5) {
                    _self.loadConsumerProductHealth();
                }
            });
        },500);
        this.loadConsumerProductHealth();
    }

    loadConsumerProductHealth() {

        var request: any = {
            productTypeId: this.selectedProductType ? this.selectedProductType : null,
        };

        this.mainService.getConsumerProductHealthReport(request)
        .subscribe(
        data => {
            this.productReport = data['data'][0];
            let productData = [ {
                'product': 'active',
                'number': this.productReport ? this.productReport.activeCount : 0,
                },  {
                'product': 'Inactive',
                'number': this.productReport ? this.productReport.inActiveCount : 0
                }
            ];
            if (!this.productReport.activeCount && !this.productReport.inActiveCount) {
                productData.push({
                     'product': 'N/A',
                     'number': 1,
                });
            }
            this.getPieChart('consumer_product_health', productData);
        },
        () => {
            this.loading = false;
        });
    }

    getPieChart(consumer_product_health, productData) {
        // Create chart instance
        let chart = am4core.create(consumer_product_health, am4charts.PieChart);

        // Add data
        chart.data = productData;

        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'number';
        pieSeries.dataFields.category = 'product';
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
