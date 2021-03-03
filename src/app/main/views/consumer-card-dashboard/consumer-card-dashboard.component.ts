import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../../machine-manufacturer/constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'ConsumerCardDashboard',
  templateUrl: './consumer-card-dashboard.component.html',
  styleUrls: [],
})
export class ConsumerCardDashboardComponent {
    loading = false;
    currentUser= undefined;
    company: any= {};
    vendorNick: any= {};
    @Input () client: any= {};
    @Input () dashboardDetail: any= {};
    @Input () consumerProductHealth: any= {};
    @Input () consumerTotalRevenue: any= {};
    @Input () productReport: any= {};
    alias: any= {};
    productType: any= {};
    boardStatus: any= {};
    productStatus: any= {};
    totalRevenue: any= {};
    companyUser: any= {};
    clientDashboard: any= {};
    consumerTotalRevenues= [];
    users= [];
    topCompanies= [];
    //totalRevenues= [];
    topVendors= [];
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    constructor(
                private titleService: Title,
                private router: Router,
                private mainService: MainService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                this.companyUser = authenticationService.getCompanyUser();
            }
        );

    }

    ngOnInit() {
        //this.loadProductStatus();
        //this.loadTotalRevenue();
        this.loadConsumerTotalRevenue();
    }

    /* companyList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
    }

    assignedCompanyProduct() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_ASSIGNED_COMPANY_PRODUCT]);
    }

    boardManufacturerList() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
    }

    machineManufacturerList() {
        this.router.navigate([MANUFACTURER_CONSTANTS.URL.MANUFACTURER_LIST]);
    }

    productList() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST_PRODUCT]);
    }

    vendorList() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
    }
    */


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

    loadConsumerTotalRevenue( ) {
        this.mainService.getConsumerTotalRevenue( )
        .subscribe(
        data => {
            this.consumerTotalRevenues = data['data'];
        },
        () => {
            this.loading = false;
        });
    }


   revenueSum() {
        let total = 0;
        for (let i = 0; i < this.consumerTotalRevenues.length; i++) {
            total = total + this.consumerTotalRevenues[i].salesRevenue + this.consumerTotalRevenues[i].productionRevenue + this.consumerTotalRevenues[i].subscriptionRevenue;
        }
        return total;
   }

    consumerList() {
        this.router.navigate([CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_LIST]);
    }



}
