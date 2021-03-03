import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'CompanyCardBuilding',
  templateUrl: './company-card-building.component.html',
  styleUrls: [],
})

export class CompanyCardBuildingComponent {
    loading = false;
    companyUser: any= {};
    productStatus: any= {};
    @Input() dashboardDetail: any= {};
    @Input() client: any= {};
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    constructor(
        private titleService: Title,
        private router: Router,
        private mainService: MainService
    )
    {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);

    }

    ngOnInit() {
        this.loadProductStatus();
    }

    newCompanyBuildingProduct() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT]);
    }

    allCompanyBuildingProduct() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_ALL_COMPANY_BUILDING_PRODUCT]);
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
