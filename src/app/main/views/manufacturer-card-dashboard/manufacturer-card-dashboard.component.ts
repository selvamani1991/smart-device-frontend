import { Component,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MACHINE_CONSTANTS } from '../../../machine/constants';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../../machine-manufacturer/constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { MainService} from '../../services/main.service';

@Component({
    selector: 'ManufacturerCardDashboard',
    templateUrl: './manufacturer-card-dashboard.component.html',
    styleUrls: [],
})
export class ManufacturerCardDashboardComponent {
    loading = false;
    dashboardDetail: any = {};
    @Input () client:any = {};
    manufacturerDashboard: any= {};
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
                private router: Router,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
    }

    ngOnInit() {
        this.loadManufacturerDashboard();
    }

    showMachineList() {
       this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST_MACHINE]);
    }

    machineProductTypeList() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE]);
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

}
