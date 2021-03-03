import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'CompanyCardDashboard',
  templateUrl: './company-card-dashboard.component.html',
  styleUrls: [],
})

export class CompanyCardDashboardComponent {
    loading = false;
    @Input () dashboardDetail: any= {};
    @Input () client: any= {};
    steps: any= [];
    productStatus: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(
                private titleService: Title,
                private router: Router,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.CUSTOMER_DASHBOARD);
    }

    ngOnInit() {
        this.loadCompanyDashboard();
        this.loadProductStatus();
    }

    loadCompanyDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    companyBuildingList() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
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

    loadProductStatus() {
        this.mainService.getProductActiveInactiveStatus()
        .subscribe(
        data => {
            this.productStatus = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }
}
