import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router,ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { DateService } from '../../../shared/services/date.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ConsumerDashboard',
  templateUrl: './consumer-dashboard.component.html',
  styleUrls: [],
})
export class ConsumerDashboardComponent {
    loading = false;
    isConsumerProduct=true;
    currentUser= undefined;
    company: any= {};
    vendorNick: any= {};
    client: any= {};
    alias: any= {};
    productType: any= {};
    boardStatus: any= {};
    companyUser: any= {};
    dashboardDetail: any= {};
    consumerProductHealth: any= {};
    consumerTotalRevenue: any= {};
    consumerTotalRevenues= [];
    clientDashboard: any= {};
    productReport: any= {};

    selectedClientSubscription: any = {id: 0};
    selectedZone: any = {id: 0};
    selectedProductType: any = {id: 0};
    zone: any= {};
    clientSubscription: any= {};
    clientSubscriptions= [];
    productTypes= [];
    zones= [];
    users= [];
    productCategories= [];
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
        this.loadConsumerDashboard();
        this.loadConsumerProductHealth();
        //this.loadConsumerTotalRevenue();
        this.loadProductTypes();

        $('#productCategoryDropDown').select2({
            width: '100%'
        });
        setTimeout(function(){
            $('#productCategoryDropDown').on("select2:select",function(e){
                var selectId = e.params.data.id;
                if(selectId=='product'){
                    _self.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
                }
                if(selectId=='consumerProduct'){
                    _self.router.navigate([MAIN_CONSTANTS.URL.CONSUMER_DASHBOARD]);
                }

            });
        },1000)
        this.loadClient();

    }

    loadConsumerDashboard( ) {
        this.mainService.getConsumerDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }


    loadConsumerProductHealth( ) {
        this.mainService.getConsumerProductActiveInactiveStatus( )
        .subscribe(
        data => {
            this.consumerProductHealth = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    /* loadConsumerTotalRevenue( ) {
        this.mainService.getConsumerTotalRevenue( )
        .subscribe(
        data => {
            this.consumerTotalRevenues = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    } */


    loadProductTypes() {
        this.mainService.getProductTypes()
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

}
