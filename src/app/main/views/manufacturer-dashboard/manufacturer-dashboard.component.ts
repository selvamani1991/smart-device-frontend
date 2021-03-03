import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MACHINE_CONSTANTS } from '../../../machine/constants';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../../machine-manufacturer/constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';

@Component({
    selector: 'ManufacturerDashboard',
    templateUrl: './manufacturer-dashboard.component.html',
    styleUrls: [],
})
export class ManufacturerDashboardComponent {
    loading = false;
    currentUser= undefined;
    dashboardDetail: any= {};
    client: any= {};
    manufacturerDashboard: any= {};
    users= [];
    topMachineManufacturers= [];
    setting: any = {
    pageTitle: 'manufacturer-dashboard.pageTitle',
    pageDesc: 'manufacturer-dashboard.pageDesc'
};
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    constructor(
                private titleService: Title,
                private mainService: MainService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        }
        );
    }

    ngOnInit() {
         this.loadManufacturerDashboard();
         this.loadClient();
    }

    loadManufacturerDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
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
