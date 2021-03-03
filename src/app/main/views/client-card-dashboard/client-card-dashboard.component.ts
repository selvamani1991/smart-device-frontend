import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { SUBSCRIPTION_CONSTANTS } from '../../../subscription/constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../../machine-manufacturer/constants';
import { PRODUCT_CONSTANTS } from '../../../product/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'ClientCardDashboard',
  templateUrl: './client-card-dashboard.component.html',
  styleUrls: [],
})
export class ClientCardDashboardComponent {
    loading = false;
    currentUser= undefined;
    company: any= {};
    vendorNick: any= {};
    @Input () client: any= {};
    @Input () dashboardDetail: any= {};
    alias: any= {};
    productType: any= {};
    boardStatus: any= {};
    productStatus: any= {};
    totalRevenue: any= {};
    companyUser: any= {};
    clientDashboard: any= {};
    users= [];
    topCompanies= [];
    totalRevenues= [];
    topVendors= [];
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
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
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
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
        this.loadProductStatus();
        this.loadTotalRevenue();
    }

    companyList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
    }

    assignedCompanyProduct() {
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
    }

    boardManufacturerList() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
    }

    productList() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST_PRODUCT]);
    }

    revenueProduct(){
        console.log('going');
        $('body,html').animate(
            {
                scrollTop: $('#RevenueProduct').offset().top
            },1000
        );
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


    loadTotalRevenue() {
        this.mainService.getTotalRevenue()
        .subscribe(
        data => {
            this.totalRevenues = data['data'];
        },
        () => {
            this.loading = false;
        });
    }

    revenueSum() {
        let total = 0;
        for (let i = 0; i < this.totalRevenues.length; i++) {
            total = total + this.totalRevenues[i].salesRevenue + this.totalRevenues[i].productionRevenue + this.totalRevenues[i].subscriptionRevenue;
        }
        return total;
    }

    vendorList() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
    }

}
