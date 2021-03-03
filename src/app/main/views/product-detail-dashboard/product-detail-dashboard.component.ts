import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'product-detail-dashboard',
  templateUrl: './product-detail-dashboard.component.html',
  styleUrls: [],
})
export class ProductDetailDashboardComponent implements OnInit {
    loading = false;
    currentUser= undefined;
    company: any= {};
    companyUser: any= {};
    users= [];
    showChart= false;
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private titleService: Title,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
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
         this.loadChart();
    }

    loadChart() {
        let ctx = document.getElementById('pieChart');
        // @ts-ignore: I don't care that it might not be a HTML Canvas Element
        ctx.height = 150;
        // @ts-ignore: I don't care that it might not be a HTML Canvas Element
    }

    changeView(chartView) {
        if (chartView !== this.showChart) {
            this.showChart = chartView;
            let self = this;
            if (this.showChart) {
                setTimeout(function(){
                 self.loadChart();
                 }, 500);
            }
        }
    }
}
