import { Component, Input } from '@angular/core';

import { APP_CONFIG } from '../../../constants';

import { MAIN_CONSTANTS } from '../../constants';


import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;


@Component({
  selector: 'ClientHealthReport',
  templateUrl: './client-health-report.component.html',
  styleUrls: [],
})
export class ClientHealthReportComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    currentUser=undefined;
    product: any= {};
    productReport: any= {};
    @Input () zones= [];
    @Input () client: any= {};
    @Input () company: any= {};
    @Input () vendor: any= {};
    @Input () productTypes= {};
    selectedProductType: any = '';
    productType: any= {};
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
            $('#selectMachineHealthReportClientSelect2').select2({
                width: '100%'
            });
            $('#selectMachineHealthReportClientSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length > 5) {
                     _self.loadProduct();
                }

            });
        },200);
        setTimeout(function(){
            $('#selectProductTypeMachineHealthReport').select2({
                width: '100%'
            });
            $('#selectProductTypeMachineHealthReport').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 5) {
                    _self.loadProduct();
                }
            });
        },200);
        this.loadProduct();
    }

    loadProduct() {
        this.mainService.getInstalledProduct(this.selectedZone ? this.selectedZone : '', this.selectedProductType ? this.selectedProductType : '')
        .subscribe(
        data => {
            if(this.currentUser.userType=='clientAdmin'){
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
                this.getPieChart('client_product_health', productData);
            }
            if(this.currentUser.userType=='zoneAdmin'){
                this.productReport = data['data'][0];
                let productData = [ {
                    'product': 'active',
                    'number': this.productReport ? this.productReport.activeCount : 0,
                    },  {
                    'product': 'Inactive',
                    'number': this.productReport ? this.productReport.inActiveCount : 0
                    }
                ];
                /*if (!this.productReport.activeCount && !this.productReport.inActiveCount) {
                    productData.push({
                         'product': 'N/A',
                         'number': 1,
                    });
                }*/
                this.getPieChart('client_product_health', productData);
            }

        },
        () => {
            this.loading = false;
        });
    }

    getPieChart(client_product_health, productData) {
        // Create chart instance
        let chart = am4core.create(client_product_health, am4charts.PieChart);

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
