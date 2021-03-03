import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'ZoneAdminDashboard',
  templateUrl: './zone-admin-dashboard.component.html',
  styleUrls: [],
})
export class ZoneAdminDashboardComponent {
    loading = false;
    currentUser= undefined;
    client: any= {};
    zoneAdmin: any= {};
    alias:any;
    companies=[];
    companyUser: any= {};
    dashboardDetail: any= {};
    users= [];
    selectedProductType: any = {id: 0};
    productTypes= [];
    setting: any = {
        pageTitle: 'pageTitle',
        pageDesc: 'pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private titleService: Title,
                private mainService: MainService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.ZONE_ADMIN_DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });


    }
    ngOnInit() {
        this.loadClientDashboard();
        this.loadClient();
        this.loadZones();
        //this.loadProductTypes();
    }

    loadClientDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    loadZones() {
        this.mainService.getCurrentVendorDetail()
        .subscribe(
        data => {
             this.zoneAdmin = data['data'][0];
             this.loadProductTypes();
             this.loadTopCompany();
        },
        () => {
            this.loading = false;
        });
    }

    loadProductTypes() {
        this.mainService.getZoneAdminProductTypes(this.zoneAdmin.zoneId)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data['data'];
                var activeProductTypes=[];
                for(let i=0; i<this.productTypes.length; i++){
                     if(this.productTypes[i].active){
                         activeProductTypes.push(this.productTypes[i])
                     }
                }
                this.productTypes=activeProductTypes;

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }
    selectProductType(productTypeId) {
        console.log(this.productTypes)
        for (let i = 0; i < this.productTypes.length; i++) {
            if (this.productTypes[i].id == productTypeId) {
                this.selectedProductType = this.productTypes[i];
            }
        }
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

    loadTopCompany() {
        this.mainService.getZoneAdminCompany(this.zoneAdmin.ownerId)
        .subscribe(
        data => {
            this.companies = data['data'];
            var activeCompanies=[];
            for(let i=0; i<this.companies.length; i++){
                 if(this.companies[i].zoneId==this.currentUser.ownerId && this.companies[i].active){
                     activeCompanies.push(this.companies[i])
                 }
            }
            this.companies=activeCompanies;
        },
        () => {
            this.loading = false;
        });
    }
}
