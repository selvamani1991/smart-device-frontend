import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ChartService } from '../../../shared/services/chart.service';

@Component({
    selector: 'DistributorStoreLocation',
    templateUrl: './distributor-store-location.component.html',
    styleUrls: [],
})
export class DistributorStoreLocationComponent {
    loading = false;
    setting: any = {
        pageTitle: 'distributor-dashboard.pageTitle',
        pageDesc: 'distributor-dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    constructor(
    private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);

    }

     ngOnInit() {

     }
}
