import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../../consumer/consumer-product-type/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { SUBSCRIPTION_CONSTANTS } from '../../../subscription/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'SuperCardDashboard',
  templateUrl: './super-card-dashboard.component.html',
  styleUrls: [],
})

export class SuperCardDashboardComponent {
    superAdmin: any= {};
    loading = false;
    dashboardDetail: any= {};
    users= [];
    setting: any = {
        pageTitle: 'super-admin-dashboard.pageTitle',
        pageDesc: 'super-admin-dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    constructor(
                private titleService: Title,
                private router: Router,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);


    }

    ngOnInit() {
        this.loadDashboard();
    }

    loadDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    clientList() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
    }

    consumerList() {
        this.router.navigate([CONSUMER_CONSTANTS.URL.CONSUMER_CONSUMER_LIST]);
    }

    subscriptionList() {
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
    }


}
