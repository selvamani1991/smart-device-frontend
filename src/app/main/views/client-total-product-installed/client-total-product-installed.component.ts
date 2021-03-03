import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

import { DateService } from '../../../shared/services/date.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';


@Component({
  selector: 'ClientTotalProductInstalled',
  templateUrl: './client-total-product-installed.component.html',
  styleUrls: [],
})
export class ClientTotalProductInstalledComponent {
    loading = false;
    consumerProduct=true;
    selectedZone: any = '';
    currentUser=undefined;
    selectedProductType: any = '';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    startDate:any='';
    endDate:any='';
    totalProductInstalled = [];
    productType: any= {};
    revenueTypes = [];
    productInstalled: any= {};
    productTypes= [];
    zoneCompanies= [];
    @Input ()zones= [];
    @Input ()client: any= {};
    @Input () companies: any= [];
    @Input () companyBuildings: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private mainService: MainService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private router: Router,
                private sweetAlertService: SweetAlertService
                ) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );


    }

    ngOnInit() {
        this.initialize();
    }

    initialize(){
        let _self = this;
        setTimeout(function(){
            $('#selectZoneInstalledProduct').select2({
               width: '100%',
               disabled: false
            });

            $('#selectZoneInstalledProduct').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedZone = selectId;
                if (_self.selectedZone.length >5) {
                    setTimeout(function(){
                        $('#select2CompanyInstalledProduct').select2({
                             width: '100%',
                             disabled: false
                        });
                    },1000);
                    _self.loadClientProductInstalled();
                }
                else {
                    $('#select2CompanyInstalledProduct').select2({
                         width: '100%',
                         disabled: true
                    });
                }

                _self.zoneCompanies = [];
                for (let i = 0; i < _self.companies.length; i++) {
                    if (_self.selectedZone == _self.companies[i].zoneId) {
                        _self.zoneCompanies.push(_self.companies[i]);
                    }
                    if (_self.selectedZone == 0) {
                        _self.zoneCompanies.push(_self.companies[i]);
                    }
                }
            });
        },1000);
        setTimeout(function(){
            $('#select2ProductTypeInstalledProduct').select2({
                width: '100%'
            });
            $('#select2ProductTypeInstalledProduct').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectedProductType = selectId;
                    if (_self.selectedProductType.length > 0) {
                        _self.loadClientProductInstalled();
                    }

            });
        },1000);
        setTimeout(function(){
            $('#select2CompanyInstalledProduct').select2({
                   width: '100%',
                   disabled: true

            });
            $('#select2CompanyInstalledProduct').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectedCompany = selectId;
                    if (_self.selectedCompany.length > 0) {
                        _self.loadClientProductInstalled();
                    }
            });
        },1000);

        $('#startDateInstalledProduct').datepicker({
                 changeMonth: true,
                 changeYear: true,
                 dateFormat: 'dd/mm/yy',
                 onSelect: (selectedDate) => {
                     this.startDate = selectedDate;
                     _self.loadClientProductInstalled();
                 }
        });

        $('#endDateInstalledProduct').datepicker({
                 changeMonth: true,
                 changeYear: true,
                 dateFormat: 'dd/mm/yy',
                 onSelect: (selectedDate) => {
                     this.endDate = selectedDate;
                     _self.loadClientProductInstalled();
                 }
        });

        this.loadProductTypes();

    }

    loadProductTypes() {
        var _self = this;
        this.mainService.getProductTypes()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                var activeProductType=[];
                for(let i=0; i<this.productTypes.length; i++){
                    if(this.productTypes[i].active && !this.productTypes[i].deleted && !this.productTypes[i].consumerProduct){
                        activeProductType.push(this.productTypes[i])
                    }
                }
                this.loadClientProductInstalled();

                this.productTypes=activeProductType;
                setTimeout(function(){
                    $('#select2ProductTypeInstalledProduct').select2({
                        width: '100%',
                        disabled: false
                    });
                    $('#select2ProductTypeInstalledProduct').on("select2:select", function (e) {
                        var selectId = e.params.data.id;
                        _self.selectProductType(selectId);
                    })
                },1000);
            }
            this.loading = false;
        },
        error => {
            this.loading = false;
        });
    }

    selectProductType(productTypeId) {
        var _self = this;
        for(var i=0;i<this.productTypes.length;i++ ){
            if(this.productTypes[i].alias == productTypeId){
                this.selectedProductType = productTypeId;
            }
        }

    }

    loadClientProductInstalled( ) {
        var request: any ;
        request = {
                zoneId: this.selectedZone && this.selectedZone.length >5  ? this.selectedZone : null,
                productTypeId: this.selectedProductType ? this.selectedProductType : null,
                companyId: this.selectedCompany && this.selectedCompany.length >5 ? this.selectedCompany : null,
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate)
        }


        this.mainService.getClientProductInstalled(request)
        .subscribe(
        data => {
            this.totalProductInstalled = data['data'];
            this.calculateGraphData();
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    calculateGraphData(){
        let productInstalledData = [];
        for (let i = 0; i < this.totalProductInstalled.length; i++) {
            var dataItem = {};
            dataItem['Month'] = this.totalProductInstalled[i].label;
            var length=this.totalProductInstalled[i].countResponseList.length;
            //length = length > 10 ? 10 : length;
            for (let j = 0; j < length; j++) {
                dataItem['value'+(j+1)] = this.totalProductInstalled[i].countResponseList[j].count;
            }
            productInstalledData.push(dataItem);
        }
        if(this.totalProductInstalled.length>0){
            this.getBarChart('installed-product', productInstalledData, this.totalProductInstalled[0].countResponseList);
        }
    }

    getBarChart(lineBar, productInstalledData, objectData ) {

        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = productInstalledData;
        chart.colors.step = 2;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'Month';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.line.strokeOpacity = 1;

        // categoryAxis.renderer.startLocation = 0;
        categoryAxis.renderer.cellStartLocation = 0.3;
        categoryAxis.renderer.cellEndLocation = 0.7;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        var length=objectData.length;
        length = length > 10 ? 10 : length;
        for (let i = 0; i < length; i++) {
            let series1 = chart.series.push(new am4charts.ColumnSeries());
            series1.columns.template.width = am4core.percent(80);
            series1.columns.template.tooltipText = '{name}: {valueY.value}';
            series1.name = objectData[i].label;
            series1.dataFields.categoryX = 'Month';
            series1.dataFields.valueY = 'value'+(i+1);
        }


        chart.legend = new am4charts.Legend();

    }


}
