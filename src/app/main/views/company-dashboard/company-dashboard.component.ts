import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { DateService } from '../../../shared/services/date.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'CompanyDashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: [],
})

export class CompanyDashboardComponent {
    loading = false;
    currentUser= undefined;
    client: any= {};
    company: any= {};
    dashboardDetail: any= {};
    companyUser: any= {};
    customerDetails: any= [];
    productDetails: any= [];
    companyProducts: any= [];
    companyBuildings: any= [];
    selectedCompanySubscription: any = {id: 0};
    selectedCompanyBuilding: any = {id: 0};
    companySubscription: any= {};
    companySubscriptions= [];
    clientSubscription: any= {};
    productType: any= {};
    zone: any= {};
    selectedProductType: any = {id: 0};
    selectedZone: any = {id: 0};
    productTypes= [];
    zones= [];
    alias: any;
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(
                private titleService: Title,
                private route: ActivatedRoute,
                private mainService: MainService,
                private dateService: DateService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.CUSTOMER_DASHBOARD);
        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                this.companyUser = authenticationService.getCompanyUser();
            }
        );

    }

    ngOnInit() {
        this.loadCompanyDashboard();
        this.loadCompanySubscriptions();
        this.loadProductTypes();
        this.loadCompanies();
        this.loadClient();
        this.loadCompanyBuilding();
    }

    loadCompanySubscriptions() {
        let _self = this;
        this.mainService.getCompanySubscriptions()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companySubscriptions = data['data'];
                var activeSubscriptions=[];
                for(let i=0; i<this.companySubscriptions.length; i++){
                     if(this.companySubscriptions[i].active){
                         activeSubscriptions.push(this.companySubscriptions[i])
                     }
                }
                this.companySubscriptions=activeSubscriptions;
                for (let i = 0; i < this.companySubscriptions.length; i++) {
                    if (this.companySubscriptions[i].startDate && this.companySubscriptions[i].startDate > 0 ) {
                        this.companySubscriptions[i].startDate = this.dateService.getDateString(this.companySubscriptions[i].startDate);
                    }
                    if (this.companySubscriptions[i].endDate && this.companySubscriptions[i].endDate > 0 ) {
                        this.companySubscriptions[i].endDate = this.dateService.getDateString(this.companySubscriptions[i].endDate);
                    }
                }
                $('#companySubscription').select2({
                    width: '100%'
                });
                $('#companySubscription').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectCompanySubscriptions(selectId);
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectCompanySubscriptions(companySubscriptionId) {
        for (let i = 0; i < this.companySubscriptions.length; i++) {
            if (this.companySubscriptions[i].id == companySubscriptionId) {
                this.selectedCompanySubscription = this.companySubscriptions[i];
            }
        }
    }

    loadCompanyDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
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

    loadCompanyBuilding() {
        this.mainService.getCompanyBuilding()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companyBuildings = data['data'];
                var activeCompanyBuildings=[];
                for(let i=0; i<this.companyBuildings.length; i++){
                    if(this.companyBuildings[i].active){
                        activeCompanyBuildings.push(this.companyBuildings[i])
                    }
                }
                this.companyBuildings=activeCompanyBuildings;
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectCompanyBuilding(companyBuildingId) {
        for (let i = 0; i < this.companyBuildings.length; i++) {
            if (this.companyBuildings[i].id == companyBuildingId) {
                this.selectedCompanyBuilding = this.companyBuildings[i];
            }
        }
    }

    loadCompanies() {
       this.mainService.getCurrentVendorDetail()
       .subscribe(
       data => {
           this.company = data['data'][0];
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
