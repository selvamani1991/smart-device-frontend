import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { DateService } from '../../../shared/services/date.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ChartService } from '../../../shared/services/chart.service';
declare var $: any;

@Component({
    selector: 'DistributorDashboard',
    templateUrl: './distributor-dashboard.component.html',
    styleUrls: [],
})
export class DistributorDashboardComponent {
    loading = false;
    currentUser= undefined;
    client: any= {};
    distributor: any= {};
    company: any= {};
    companyUser: any= {};
    dashboardDetail: any= {};
    distributorDashboard: any= {};
    users= [];
    selectedDistributorSubscription: any = {id: 0};
    distributorSubscription: any= {};
    distributorSubscriptions= [];
    selectedZone: any = {id: 0};
    selectedProductType: any = {id: 0};
    zone: any= {};
    productType: any= {};
    productTypes= [];
    zones= [];
    alias: any;
    topCompanies= [];
    topDistributorProducts= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private route: ActivatedRoute,
                private mainService: MainService,
                private dateService: DateService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
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
        this.loadDistributorDashboard();
        this.loadDistributorSubscriptions();
        this.loadProductTypes();
        this.loadDistributors();
        this.loadClient();
        setTimeout(function(){
            $('#distributorSubscription').select2({
                width: '100%'
            });
        },200);
     }

     loadDistributorSubscriptions() {
         let _self = this;
         this.mainService.getDistributorSubscriptions()
         .subscribe(
         data => {
             if (!data['hasError']) {
                 this.distributorSubscriptions = data['data'];
                 var activeSubscriptions=[];
                 for(let i=0; i<this.distributorSubscriptions.length; i++){
                      if(this.distributorSubscriptions[i].active){
                          activeSubscriptions.push(this.distributorSubscriptions[i])
                      }
                 }
                 this.distributorSubscriptions=activeSubscriptions;
                 for (let i = 0; i < this.distributorSubscriptions.length; i++) {
                     if (this.distributorSubscriptions[i].startDate && this.distributorSubscriptions[i].startDate > 0 ) {
                         this.distributorSubscriptions[i].startDate = this.dateService.getDateString(this.distributorSubscriptions[i].startDate);
                     }
                     if (this.distributorSubscriptions[i].endDate && this.distributorSubscriptions[i].endDate > 0 ) {
                         this.distributorSubscriptions[i].endDate = this.dateService.getDateString(this.distributorSubscriptions[i].endDate);
                     }
                 }
                 $('#distributorSubscription').select2({
                     width: '100%'
                 });
                 $('#distributorSubscription').on('select2:select', function(e){
                     let selectId = e.params.data.id;
                     _self.selectDistributorSubscriptions(selectId);
                 });

             }
             this.loading = false;
         },
         () => {
             this.loading = false;
         });
     }


     selectDistributorSubscriptions(distributorSubscriptionId) {
         for (let i = 0; i < this.distributorSubscriptions.length; i++) {
             if (this.distributorSubscriptions[i].id == distributorSubscriptionId) {
                 this.selectedDistributorSubscription = this.distributorSubscriptions[i];
             }
         }
     }

     loadDistributorDashboard( ) {
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

    loadDistributors() {
       this.mainService.getCurrentVendorDetail()
       .subscribe(
       data => {
           this.distributor = data['data'][0];
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
