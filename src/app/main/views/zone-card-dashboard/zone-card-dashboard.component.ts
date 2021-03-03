import { Component,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'ZoneCardDashboard',
  templateUrl: './zone-card-dashboard.component.html',
  styleUrls: [],
})
export class ZoneCardDashboardComponent {
    loading = false;
    currentUser= undefined;
    company: any= {};
    @Input() client:any={};
    @Input() dashboardDetail:any={};
    companyUser: any= {};
    users= [];
    setting: any = {
        pageTitle: 'pageTitle',
        pageDesc: 'pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private titleService: Title,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.BUILDING_ADMIN_DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.authenticationService.sessionChange$.subscribe(
                    () => {
                        this.currentUser = authenticationService.getCurrentUser();
                        this.companyUser = authenticationService.getCompanyUser();
                    }
        );


    }

}
