import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { MainService} from '../../services/main.service';

@Component({
    selector: 'DistributorCardDashboard',
    templateUrl: './distributor-card-dashboard.component.html',
    styleUrls: [],
})
export class DistributorCardDashboardComponent {
    loading = false;
    steps: any= [];
    @Input() dashboardDetail: any= {};
    @Input() client: any= {};
    productStatus: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    constructor(
    private titleService: Title,
    private router: Router,
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);

    }

     ngOnInit() {
        this.loadProductStatus();
     }

     companyList() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
     }

     allDistributorProductList() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ALL_DISTRIBUTOR_PRODUCT]);
     }

     newDistributorProduct() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT]);
     }

     assignedCompanyProduct() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT]);
     }

     loadProductStatus() {
         this.mainService.getProductActiveInactiveStatus()
         .subscribe(
         data => {
             this.productStatus = data['data'][0];
         },
         () => {
             this.loading = false;
         });
     }

}
