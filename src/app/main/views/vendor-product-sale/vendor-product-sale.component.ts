import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'VendorProductSale',
  templateUrl: './vendor-product-sale.component.html',
  styleUrls: [],
})
export class VendorProductSaleComponent {
    loading = false;
    currentUser= undefined;
    client: any= {};
    company: any= {};
    vendorDashboard: any= {};
    dashboardDetail: any= {};
    companyUser: any= {};
    users= [];
    alias: any;
    selectedZone: any = {id: 0};
    zone: any= {};
    zones= [];
    selectedProductType: any = {id: 0};
    productType: any= {};
    productTypes= [];
    selectedVendorSubscription: any = {id: 0};
    vendorSubscription: any= {};
    vendorSubscriptions= [];
    topDistributors= [];
    topCompanies= [];
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    constructor(
                private titleService: Title,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
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

    }

}
