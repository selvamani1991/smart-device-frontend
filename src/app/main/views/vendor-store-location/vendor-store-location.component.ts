import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';

@Component({
  selector: 'VendorStoreLocation',
  templateUrl: './vendor-store-location.component.html',
  styleUrls: [],
})
export class VendorStoreLocationComponent {
    loading = false;
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
    private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);

    }

    ngOnInit() {

    }


}
