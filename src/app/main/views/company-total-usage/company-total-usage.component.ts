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
  selector: 'CompanyTotalUsage',
  templateUrl: './company-total-usage.component.html',
  styleUrls: [],
})
export class CompanyTotalUsageComponent {
    loading = false;
    selectedZone: any = '';
    currentUser=undefined;
    selectedProductType: any = '';
    selectedComponent: any = '';
    selectedCompany: any = '';
    selectedCompanyBuilding: any = '';
    startDate:any='';
    endDate:any='';
    productType: any= {};
    revenueTypes = [];
    components = [];
    totalUsage = [];
    componentList= [];
    productTypeRevenue: any= {};
    productTypes:any= [];
    oldCompanies: any = [];
    zoneCompanies: any = [];
    //@Input ()zones= [];
    @Input ()client: any= {};
    //@Input () companies: any= [];
    @Input () companyBuildings: any= [];
     @Input () company: any= [];
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
        this.loadProductTypes();

    }

    ngOnInit() {
    this.initialize();
    }
    initialize(){
        let _self = this;
        setTimeout(function(){
            $('#selectProductTypeCompanyUsage').select2({
               width: '100%'
            });
            /*$('#selectProductTypeCompanyUsage').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 0) {
                    $('#selectComponentCompanyUsage').select2({
                        width: '100%',
                        disabled: false

                    });
                    _self.loadTotalUsage();
                }
            });*/

            $('#selectCompanyBuildingCompanyUsage').select2({
               width: '100%',
            });
            $('#selectCompanyBuildingCompanyUsage').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedCompanyBuilding = selectId;
                if (_self.selectedCompanyBuilding.length > 5) {
                    _self.loadTotalUsage();
                }
            });

            $('#selectComponentCompanyUsage').select2({
               width: '100%',
            });

            $('#selectComponentCompanyUsage').on('select2:select', function(e){
                var selectId = e.params.data.id;
                 _self.selectedComponent = selectId;
                if (_self.selectedComponent.length > 0) {
                        _self.loadTotalUsage();
                }
            });


        },1000);

        $('#startDateClientUsage').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                console.log(selectedDate);
                 this.startDate = selectedDate;
                 _self.loadTotalUsage();
             }
        });

        $('#endDateClientUsage').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                console.log(selectedDate);
                 this.endDate = selectedDate;
                 _self.loadTotalUsage();
             }
        });
    }

    loadProductTypes() {
        var _self = this;
        //this.mainService.getCurrentProductType()
        this.mainService.getProductTypeForGraph()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data["data"];
                var activeProductType=[];
                for(let i=0; i<this.productTypes.length; i++){
                    if(this.productTypes[i].active && !this.productTypes[i].deleted && this.currentUser.ownerId){
                        activeProductType.push(this.productTypes[i])
                    }
                }
                this.productTypes=activeProductType;
                if(this.productTypes.length> 0){
                    this.selectedProductType=this.productTypes[0].alias;
                    this.components=this.productTypes[0].components;
                    var validComponents =[];

                    for( var i=0;i< this.components.length ;i++){
                        if(this.components[i].showInGraph){
                           validComponents.push(this.components[i]);
                            this.componentList.push(this.components[i].name)
                        }
                    }
                    this.components = validComponents;
                    if(this.selectedProductType.length>0){
                        this.initializeComponent();
                        this.loadTotalUsage();
                    }


                }
                setTimeout(function(){
                $('#selectProductTypeCompanyUsage').select2({
                    width: '100%',
                    disabled: false
                });
                $('#selectProductTypeCompanyUsage').on("select2:select", function (e) {
                    var selectId = e.params.data.id;
                    this.selectedProductType=selectId;
                    _self.selectProductType(selectId);
                    _self.loadTotalUsage();
                });
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
        //console.log(this.productTypes);
        for(var i=0;i<this.productTypes.length;i++ ){
            if(this.productTypes[i].alias == productTypeId){
                this.selectedProductType = productTypeId;
                console.log(this.selectedProductType);
                this.components=this.productTypes[i].components;
                this.componentList=[];

                var validComponents =[];
                for( var i=0;i< this.components.length ;i++){
                    if(this.components[i].showInGraph){
                       validComponents.push(this.components[i]);
                        this.componentList.push(this.components[i].name)
                    }
                }
                this.components=validComponents;
            }
        }
    }

    initializeComponent(){
        var _self=this;
         setTimeout(function(){
        $('#selectComponentCompanyUsage').select2({
           width: '100%',
           disabled: false,
           closeOnSelect : true,
           placeholder : "Select Component",
           allowHtml: true,
           allowClear: true,
           tags: true
        });

        $('#selectComponentCompanyUsage').on("select2:select", function (e) {
            var selectId = e.params.data.id;

            _self.selectedComponent= selectId;
            if(_self.componentList.length  == _self.components.length){
                _self.componentList = [];
            }
            for( var i=0;i< _self.components.length ;i++){
                if(_self.components[i].id==selectId || selectId == 0){
                    if(!_self.componentList.includes(_self.components[i].name)){
                        _self.componentList.push(_self.components[i].name);
                    }
                }
            }
            console.log(_self.componentList);
            _self.calculateGraphData();
        });
        },500);

        $('#selectComponentCompanyUsage').on("select2:unselecting", function (e) {
            var unselected_value = $('#selectComponentCompanyUsage').val();
            if(unselected_value.length == 0 ){
                _self.componentList=[];
                for( var i=0;i< _self.components.length ;i++){
                    _self.componentList.push(_self.components[i].name);
                }
            }else{
                var selectId = e.params.args.data.id; //your id
                console.log(selectId);
                for( var i=0;i< _self.components.length ;i++){
                    if(_self.components[i].id==selectId){
                        for( var j=0;j< _self.componentList.length ;j++){
                            if(_self.components[i].name == _self.componentList[j]){
                                _self.componentList.splice(j,1);
                                break;
                            }
                        }
                    }
                }
                if(_self.componentList.length == 0){
                    _self.componentList=[];
                    for( var i=0;i< _self.components.length ;i++){
                        _self.componentList.push(_self.components[i].name);
                    }
                }
            }

            _self.calculateGraphData();
        });
    }

    loadTotalUsage( ) {
        var request: any = {
                productTypeId: this.selectedProductType ? this.selectedProductType : null,
                companyBuildingId: this.selectedCompanyBuilding ? this.selectedCompanyBuilding : null,
                startDate: this.dateService.getLongFromString(this.startDate),
                endDate: this.dateService.getLongFromString(this.endDate)

        };

        this.mainService.getCompanyTotalUsage(request)
        .subscribe(
        data => {
            this.totalUsage = data['data'];
            this.calculateGraphData();

        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });

        /* .subscribe(
        data => {
            let productTypeRevenue = data['data'];
            let productTypeBarData = [];
            for (let i = 0; i < productTypeRevenue.length; i++) {
                productTypeBarData.push(
                {
                   'Month': productTypeRevenue[i].label,
                   'Component': productTypeRevenue[i].count
                });
            }
            this.getBarChart('total-usage-bar', productTypeBarData);
        },
        () => {
            this.loading = false;
        }); */
    }

    calculateGraphData(){
        let usageData = [];
        console.log(this.componentList);
        for (let i = 0; i < this.totalUsage.length; i++) {
            var dataItem = {};
            dataItem['Month'] = this.totalUsage[i].label;
            var length=this.totalUsage[i].countResponseList.length;
            length = length > 10 ? 10 : length;
            for (let j = 0; j < length; j++) {
                //if(this.errorList.includes(this.totalError[i].countResponseList[j].label)){
                    dataItem['value'+(j+1)] = this.totalUsage[i].countResponseList[j].count;
                //}
            }
            usageData.push(dataItem);
        }
        console.log(usageData);
        this.getBarChart('company-total-usage-data-bar', usageData, this.totalUsage[0].countResponseList);
    }

    getBarChart(lineBar, usageData, objectData ) {
        let chart = am4core.create(lineBar, am4charts.XYChart);
        chart.data = usageData;
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
        //length = length > 10 ? 10 : length;

        for (let i = 0; i < length; i++) {
            if(this.componentList.includes(objectData[i].label)){
                let series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.width = am4core.percent(80);
                series1.columns.template.tooltipText = '{name}: {valueY.value}';
                series1.name = objectData[i].label;
                series1.dataFields.categoryX = 'Month';
                series1.dataFields.valueY = 'value'+(i+1);
            }
        }


        chart.legend = new am4charts.Legend();

    }
    showZone() {
        if (this.selectedProductType.length > 0) {
            $('#selectComponentCompanyUsage').select2('disable', false);
        }else {
            $('#selectComponentCompanyUsage').select2('disable', true);
        }
    }

    showCompany() {
        if (this.selectedZone.length > 0) {
            $('#selectCompanyUsage').select2('disable', false);
        }else {
            $('#selectCompanyUsage').select2('disable', true);
        }
    }

}
