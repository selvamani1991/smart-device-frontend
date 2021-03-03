import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;
import { DateService } from '../../../shared/services/date.service';

@Component({
  selector: 'CompanyTotalHealth',
  templateUrl: './company-total-health.component.html',
  styleUrls: [],
})
export class CompanyTotalHealthComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    currentUser=undefined;
    product: any= {};
    productReport: any= {};
    @Input () zones= [];
    @Input () client: any= {};
    @Input () companies: any= [];
    @Input () vendor: any= {};
    @Input () productTypes= [];
    @Input () companyBuildings= [];
    selectedProductType: any = '';
    startDate:any='';
    endDate:any='';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    productType: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
        private mainService: MainService,
        private authenticationService: AuthenticationService,
        private dateService: DateService
    ){
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
            $('#selectProductTypeCompanyHealth').select2({
                width: '100%'
            });
            $('#selectProductTypeCompanyHealth').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 5) {
                    _self.loadProduct();
                }
            });

            $('#selectBuildingCompanyHealth').select2({
                width: '100%',
            });
            $('#selectBuildingCompanyHealth').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompanyBuilding = selectId;
                if (_self.selectedCompanyBuilding.length > 5) {
                    _self.loadProduct();
                }
            });
        },1000);

        $('#startDateCompanyHealth').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.startDate = selectedDate;
                 _self.loadProduct();
             }
        });

        $('#endDateCompanyHealth').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.endDate = selectedDate;
                 _self.loadProduct();
             }
        });

        this.loadProduct();
    }

    loadProduct() {
        var request: any;
        request = {
            productTypeId: this.selectedProductType ? this.selectedProductType : null,
            companyBuildingId: this.selectedCompanyBuilding  && this.selectedCompanyBuilding.length >5 ? this.selectedCompanyBuilding : null,
            startDate: this.dateService.getLongFromString(this.startDate),
            endDate: this.dateService.getLongFromString(this.endDate)

        };
        this.mainService.getClientTotalHealth(request)
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
                this.getPieChart('company_product_health', productData);

        },
        () => {
            this.loading = false;
        });
    }

    getPieChart(company_product_health, productData) {
        // Create chart instance
        let chart = am4core.create(company_product_health, am4charts.PieChart);

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