import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { DateService } from '../../../shared/services/date.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ClientDashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: [],
})
export class ClientDashboardComponent {
    loading = false;
    currentUser= undefined;
    consumerProduct=true;
    company: any= {};
    vendorNick: any= {};
    @Input () client: any= {};
    alias: any= {};
    productType: any= {};
    boardStatus: any= {};
    companyUser: any= {};
    dashboardDetail: any= {};
    clientDashboard: any= {};
    selectedProductCategory: any = {id: 0};
    selectedClientSubscription: any = {id: 0};
    selectedZone: any = {id: 0};
    selectedCompany: any = {id: 0};
    selectedProductType: any = {id: 0};
    zone: any= {};
    clientSubscription: any= {};
    clientSubscriptions= [];
    productCategories= [];
    productTypes= [];
    zones= [];
    companies= [];
    users= [];
    topCompanies= [];
    topVendors= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private titleService: Title,
                private mainService: MainService,
                private dateService: DateService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });

        this.currentUser = this.authenticationService.getCurrentUser();
        this.companyUser = this.authenticationService.getCompanyUser();
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                this.companyUser = authenticationService.getCompanyUser();
            }
        );

        this.productCategories=[
            {'id':'product','name':'Product'},
            {'id':'consumerProduct','name':"ConsumerProduct"}
        ];

    }

    ngOnInit() {
        var _self=this;
        this.loadClientDashboard();
        this.loadClientSubscriptions();
        this.loadZones();
        this.loadClient();
        this.loadProductTypes();
        this.loadCompanies();

        $('#productCategoryDropDown').select2({
            width: '100%'
        });
        setTimeout(function(){
            $('#productCategoryDropDown').on("select2:select",function(e){
                var selectId = e.params.data.id;
                if(selectId=='consumerProduct'){
                    _self.router.navigate([MAIN_CONSTANTS.URL.CONSUMER_DASHBOARD]);
                }
            });
        },1000)



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

    loadClientSubscriptions() {
        let _self = this;
        this.mainService.getClientSubscriptions()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.clientSubscriptions = data['data'];
                var activeSubscriptions=[];
                for(let i=0; i<this.clientSubscriptions.length; i++){
                     if(this.clientSubscriptions[i].active){
                         activeSubscriptions.push(this.clientSubscriptions[i])
                     }
                }
                this.clientSubscriptions=activeSubscriptions;
                for (let i = 0; i < this.clientSubscriptions.length; i++) {
                    if (this.clientSubscriptions[i].startDate && this.clientSubscriptions[i].startDate > 0 ) {
                        this.clientSubscriptions[i].startDate = this.dateService.getDateString(this.clientSubscriptions[i].startDate);
                    }
                    if (this.clientSubscriptions[i].endDate && this.clientSubscriptions[i].endDate > 0 ) {
                        this.clientSubscriptions[i].endDate = this.dateService.getDateString(this.clientSubscriptions[i].endDate);
                    }
                }
                $('#clientSubscriptionDropDown').select2({
                    width: '100%'
                });
                $('#clientSubscriptionDropDown').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectClientSubscriptions(selectId);
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }


    selectClientSubscriptions(clientSubscriptionId) {
        for (let i = 0; i < this.clientSubscriptions.length; i++) {
            if (this.clientSubscriptions[i].id == clientSubscriptionId) {
                this.selectedClientSubscription = this.clientSubscriptions[i];
            }
        }
    }

    loadZones() {
        this.mainService.getZones()
        .subscribe(
        data => {
            if (!data['hasError']) {
                    this.zones = data['data'];
                    var activeZones=[];
                    for(let i=0; i<this.zones.length; i++){
                         if(this.zones[i].active){
                             activeZones.push(this.zones[i])
                         }
                    }
                    this.zones=activeZones;
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectZone(zoneId) {
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].id == zoneId) {
                this.selectedZone = this.zones[i];
            }
        }
    }

    loadProductTypes() {
        this.mainService.getProductTypes()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.productTypes = data['data'];
                var activeProductTypes=[];
                for(let i=0; i<this.productTypes.length; i++){
                     if(this.productTypes[i].active && !this.productTypes[i].deleted && !this.productTypes[i].consumerProduct){
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

     loadCompanies() {
        this.mainService.getCompanies()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.companies = data['data'];
                var activeCompanies=[];
                for(let i=0; i<this.companies.length; i++){
                    if(this.companies[i].active){
                        activeCompanies.push(this.companies[i])
                    }
                }
                this.companies=activeCompanies;
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
     }

     selectCompany(companyId) {
        for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].id == companyId) {
                this.selectedCompany = this.companies[i];
            }
        }
     }

}
