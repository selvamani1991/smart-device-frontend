import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import Chart from '../../../../assets/plugins/chart.js/Chart.bundle.min.js';
declare var $: any;

@Component({
  selector: 'ClientProductSale',
  templateUrl: './client-product-sale.component.html',
  styleUrls: [],
})

export class ClientProductSaleComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    currentUser=undefined;
    monthlyRevenue: any= {};
    @Input () zones= [];
    @Input () client: any= {};
    selectedProductType: any = '';
    productType: any= {};
    @Input () productTypes;
    topProductTypes: any= [];
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
            $('#selectZoneProductSale').select2({
               width: '100%'
            });
            $('#selectZoneProductSale').on('select2:select', function(e){
               let selectId = e.params.data.id;
                 _self.selectedZone = selectId;
                 if (_self.selectedZone.length > 5) {
                     _self.loadSalesRevenue();
                 }
            });
        },500);
        $('#selectProductTypeProductSale').select2({
           width: '100%'
        });
        $('#selectProductTypeProductSale').on('select2:select', function(e){
            let selectId = e.params.data.id;
            _self.selectedProductType = selectId;
            if (_self.selectedProductType.length > 5) {
               _self.loadSalesRevenue();
            }
        });
          this.loadSalesRevenue();
    }

    loadSalesRevenue( ) {
        this.mainService.getSalesRevenue(this.selectedZone ? this.selectedZone : '', this.selectedProductType ? this.selectedProductType : '')
        .subscribe(
            data => {
            this.monthlyRevenue = data['data'][0];
            let salesRevenueData = {

                labels: this.monthlyRevenue.monthList,
                type: 'line',
                defaultFontFamily: 'Montserrat',
                datasets: [
                    {
                        data: this.monthlyRevenue.productionRevenue,
                        label: 'ProductionRevenue',
                        backgroundColor: '#847DFA',
                        borderColor: '#847DFA',
                        borderWidth: 0.5,
                        pointStyle: 'circle',
                        pointRadius: 5,
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: '#847DFA',
                    },
                    {
                        label: 'SalesRevenue',
                        data: this.monthlyRevenue.salesRevenue,
                        backgroundColor: '#F196B0',
                        borderColor: '#F196B0',
                        borderWidth: 0.5,
                        pointStyle: 'circle',
                        pointRadius: 5,
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: '#F196B0',
                    },
                    {

                        label: 'SubscriptionRevenue',
                        data: this.monthlyRevenue.subscriptionRevenue,
                        backgroundColor: '#96DFF1',
                        borderColor: '#96DFF1',
                        borderWidth: 0.5,
                        pointStyle: 'circle',
                        pointRadius: 5,
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: '#96dff1',
                    },
                ],
            };
            this.getGraph(salesRevenueData);
            },
            () => {
                this.loading = false;
            });
    }

    getGraph(salesRevenueData) {
        let ctx = document.getElementById('chart_widget_2');
        // ctx.height = 280;
        new Chart(ctx, {
            type: 'line',
            data: salesRevenueData,
            options: {
                responsive: !0,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    titleFontSize: 12,
                    titleFontColor: '#000',
                    bodyFontColor: '#000',
                    backgroundColor: '#fff',
                    titleFontFamily: 'Montserrat',
                    bodyFontFamily: 'Montserrat',
                    cornerRadius: 3,
                    intersect: false,
                },
                legend: {
                    display: false,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        fontFamily: 'Montserrat',
                    },


                },
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                },
                title: {
                    display: false,
                }
            }
        });
    }

}
