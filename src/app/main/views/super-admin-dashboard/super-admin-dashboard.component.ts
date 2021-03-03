import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../../consumer/consumer-product-type/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { SUBSCRIPTION_CONSTANTS } from '../../../subscription/constants';
import { MainService} from '../../services/main.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'SuperAdminDashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: [],
})

export class SuperAdminDashboardComponent {
    superAdmin: any= {};
    loading = false;
    currentUser= undefined;
    dashboardDetail: any= {};
    companyUser: any= {};
    client: any= {};
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
                private authenticationService: AuthenticationService,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
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
        this.loadClient();
    }
    loadClient() {
       this.mainService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
           this.client = data['data'][0];
       },
       () => {
           this.loading = false;
       });
    }

}
