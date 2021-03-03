import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;


@Component({
  selector: 'ClientMachineProduct',
  templateUrl: './client-machine-product.component.html',
  styleUrls: [],
})
export class ClientMachineProductComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    reportDataLists: any= [];
    reportDataList: any= {};
    product: any= {};
    currentUser=undefined;
    @Input () zones= [];
    @Input () client: any= {};
    @Input () productTypes= [];
    selectedProductType: any = '';
    productType: any= {};
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
            $('#selectZoneMachinesProducts').select2({
               width: '100%',
               disabled: true
            });
            $('#selectZoneMachinesProducts').on('select2:select', function(e){
               let selectId = e.params.data.id;
               _self.selectedZone = selectId;
                _self.loadProductType();

            });
        },500);
        $('#selectProductTypeMachinesProducts').select2({
           width: '100%'
        });
        $('#selectProductTypeMachinesProducts').on('select2:select', function(e){
           let selectId = e.params.data.id;
           _self.selectedProductType = selectId;
            if (_self.selectedProductType.length > 5) {
                  $('#selectZoneMachinesProducts').select2({
                     width: '100%',
                     disabled: false
                  });
                  _self.loadProductType();
            }else {
                $('#selectZoneMachinesProducts').select2({
                     width: '100%',
                     disabled: true
                  });
            }
        });
        let productData = [];
        productData.push({
            'component': 'N/A',
            'number': 1,
        });
        this.getZonalPieChart('client_zonal_product_report', productData);
    }

    loadProductType() {
        this.mainService.getProductTypeComponent(this.selectedZone ? this.selectedZone : '', this.selectedProductType ? this.selectedProductType : '')
        .subscribe(
        data => {
            let reportDataList = data['data'];
            let productData = [];
            let found = true;
            for (let i = 0; i < reportDataList.length; i++) {
                productData.push({'component': reportDataList[i].name, 'number': reportDataList[i].value});
                if (reportDataList[i].value > 0) {
                   found = false;
                }
            }
            if (found) {
                productData.push({
                    'component': 'N/A',
                    'number': 1,
                });
            }
            this.getZonalPieChart('client_zonal_product_report', productData);
        },
        () => {
            this.loading = false;
        });
    }


    getZonalPieChart(client_zonal_product_report, productData) {
        // Create chart instance
        let chart = am4core.create(client_zonal_product_report, am4charts.PieChart);

        // Add data
        chart.data = productData;

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
        // chart.legend = new am4charts.Legend();
    }

    showZone() {
        if (this.selectedProductType.length > 0) {
            $('#selectZoneMachinesProducts').select2('disable', false);
        }else {
            $('#selectZoneMachinesProducts').select2('disable', true);
        }
    }


}
