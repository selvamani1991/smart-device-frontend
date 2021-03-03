import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'VendorCardDashboard',
  templateUrl: './vendor-card-dashboard.component.html',
  styleUrls: [],
})
export class VendorCardDashboardComponent {
    loading = false;
    vendorDashboard: any= {};
    productStatus: any= {};
    @Input() dashboardDetail: any= {};
    @Input() client: any= {};
    users= [];
    alias: any;
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
                private router: Router,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
    }

    ngOnInit() {
        this.loadProductStatus();
    }

    companyList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
    }

    distributorList() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
    }

    assignedCompanyProduct() {
           this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT]);
        }

    allVendorProduct() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ALL_VENDOR_PRODUCT]);
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
