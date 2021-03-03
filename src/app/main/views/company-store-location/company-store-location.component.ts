import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';

@Component({
  selector: 'CompanyStoreLocation',
  templateUrl: './company-store-location.component.html',
  styleUrls: [],
})

export class CompanyStoreLocationComponent {
    loading = false;
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
    private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.CUSTOMER_DASHBOARD);

    }

    ngOnInit() {

    }
}
