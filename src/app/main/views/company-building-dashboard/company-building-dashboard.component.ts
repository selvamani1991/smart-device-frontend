import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';



@Component({
  selector: 'CompanyBuildingDashboard',
  templateUrl: './company-building-dashboard.component.html',
  styleUrls: [],
})

export class CompanyBuildingDashboardComponent {
    loading = false;
    currentUser= undefined;
    companyBuildingDashboard: any= {};
    dashboardDetail: any= {};
    companyUser: any= {};
    client: any= {};
    users= [];
    productType: any= {};
    selectedProductType: any = {id: 0};
    productTypes= [];
    topCompanyBuildingProducts= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    constructor(
                private titleService: Title,
                private mainService: MainService,
                private authenticationService: AuthenticationService) {
    this.CONFIG = APP_CONFIG;
    this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
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
        this.loadProductTypes();
        this.loadCompanyBuildingDashboard();
        this.loadTopCompanyBuildingProduct();
        this.loadClient();
    }


    loadProductTypes() {
        this.mainService.getCurrentProductType()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data['data'];

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectProductType(productTypeId) {
        for (let i = 0; i < this.productTypes.length; i++) {
            if (this.productTypes[i].id == productTypeId) {
                this.selectedProductType = this.productTypes[i];
            }
        }
    }

    loadCompanyBuildingDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    loadTopCompanyBuildingProduct( ) {
        this.mainService.getTopCompanyBuildingProduct( )
        .subscribe(
        data => {
            this.topCompanyBuildingProducts = data['data'];
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
