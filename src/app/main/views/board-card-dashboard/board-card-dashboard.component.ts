import { Component,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { BOARD_CONSTANTS } from '../../../board/constants';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../../board-manufacturer/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'BoardCardDashboard',
  templateUrl: './board-card-dashboard.component.html',
  styleUrls: [],
})
export class BoardCardDashboardComponent {
    loading= false;
    dashboardDetail: any= {};
    @Input () client:any={};
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    BOARD_CONSTANTS= BOARD_CONSTANTS;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    constructor(
                private titleService: Title,
                private router: Router,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.BOARD_CONSTANTS = BOARD_CONSTANTS;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
    }

    ngOnInit() {
        this.loadBoardManufacturerDashboard();
    }

    showBoardList() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST_BOARD]);
    }

    boardProductTypeList() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE]);
    }

    loadBoardManufacturerDashboard( ) {
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
