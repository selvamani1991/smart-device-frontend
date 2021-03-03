import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
declare var $: any;

@Component({
  selector: 'CompanyMachineHealth',
  templateUrl: './company-machine-health.component.html',
  styleUrls: [],
})

export class CompanyMachineHealthComponent {
    loading = false;
    currentUser= undefined;
    client: any= {};
    company: any= {};
    companyDashboard: any= {};
    dashboardDetail: any= {};
    companyUser: any= {};
    customerDetails: any= [];
    productDetails: any= [];
    users= [];
    selectedCompanySubscription: any = {id: 0};
    companySubscription: any= {};
    companySubscriptions= [];
    alias: any;
    topCompanyBuildings= [];
    topCompanyProducts= [];
    setting: any = {
        pageTitle: 'pageTitle',
        pageDesc: 'pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(
                private titleService: Title,
                private router: Router,
                private route: ActivatedRoute,
                private mainService: MainService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.CUSTOMER_DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                this.companyUser = authenticationService.getCompanyUser();
            }
        );

    }

    ngOnInit() {
        this.loadCompanyDashboard();
        this.loadTopCompanyBuilding();
        this.loadTopCompanyProduct();
        this.loadCompanySubscriptions();
        this.getPieChart('health');
        this.getZonalPieChart('zonal-product');

    }


    loadCompanySubscriptions() {
        let _self = this;
        this.mainService.getCompanySubscriptions()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companySubscriptions = data['data'];
                $('#companySubscription').select2({
                    width: '100%'
                });
                $('#companySubscription').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectCompanySubscriptions(selectId);
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectCompanySubscriptions(companySubscriptionId) {
        for (let i = 0; i < this.companySubscriptions.length; i++) {
            if (this.companySubscriptions[i].id === companySubscriptionId) {
                this.selectedCompanySubscription = this.companySubscriptions[i];
            }
        }
    }

    loadCompanyDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    companyBuildingList() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
    }

    loadTopCompanyBuilding( ) {
        this.mainService.getTopCompanyBuilding( )
        .subscribe(
        data => {
            this.topCompanyBuildings = data['data'];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    loadTopCompanyProduct( ) {
        this.mainService.getTopCompanyProduct( )
        .subscribe(
        data => {
            this.topCompanyProducts = data['data'];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
            this.loading = false;
        });
    }

    newProductList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
    }

    productList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_COMPANY_PRODUCT]);
    }

    assignedProductList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
    }

    allCompanyProduct() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ALL_COMPANY_PRODUCT]);
    }

    getPieChart(health) {
        // Create chart instance
        let chart = am4core.create(health, am4charts.PieChart);

        // Add data
        chart.data = [ {
            'product': 'Active',
            'number': 40,
            },  {
            'product': 'Inactive',
            'number': 60
            }
        ];

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
    }

    getZonalPieChart(zonal) {
        // Create chart instance
        let chart = am4core.create(zonal, am4charts.PieChart);

        // Add data
        chart.data = [ {
        'component': 'Coffee',
        'number': 25,
        },  {
        'component': 'Tea',
        'number': 45,
        },
        {
        'component': 'Drink',
        'number': 30,
        }
        ];

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
