import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { USER_TYPES } from '../../../menu/constants';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent {
    loading = false;
    currentUser= undefined;
    company: any= {};
    companyUser: any= {};
    users= [];
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    USER_TYPES= USER_TYPES;
    constructor(
                private titleService: Title,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.USER_TYPES = USER_TYPES;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.authenticationService.sessionChange$.subscribe(
                    () => {
                        this.currentUser = authenticationService.getCurrentUser();
                        // console.log(this.currentUser);
                        this.companyUser = authenticationService.getCompanyUser();
                    }
        );


    }



}
