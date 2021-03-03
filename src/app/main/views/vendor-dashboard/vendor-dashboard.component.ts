import { Component,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { DateService } from '../../../shared/services/date.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'VendorDashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: [],
})
export class VendorDashboardComponent {
    loading = false;
    currentUser= undefined;
    company: any= {};
    vendorNick: any= {};
    @Input() vendor: any= {};
    alias: any= {};
    productType: any= {};
    client: any= {};
    boardStatus: any= {};
    companyUser: any= {};
    dashboardDetail: any= {};
    vendorDashboard: any= {};
    selectedVendorSubscription: any = {id: 0};
    selectedProduct: any = {id: 0};
    selectedProductType: any = {id: 0};
    product: any= {};
    vendorSubscription: any= {};
    vendorSubscriptions= [];
    productTypes= [];
    products= [];
    users= [];
    topCompanies= [];
    topVendors= [];
    vendorProducts= [];
    setting: any = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private route: ActivatedRoute,
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

    }

    ngOnInit() {
        this.loadVendorDashboard();
        this.loadVendorSubscriptions();
        this.loadProducts();
        this.loadProductTypes();
        this.loadClient();
        this.loadCurrentVendor();
        this.loadVendorProducts();
        setTimeout(function(){
            $('#vendorSubscription').select2({
                width: '100%'
            });
        },200);

    }

    loadVendorDashboard( ) {
        this.mainService.getDashboard( )
        .subscribe(
        data => {
            this.dashboardDetail = data['data'][0];
        },
        () => {
            this.loading = false;
        });
    }

    loadVendorSubscriptions() {
        let _self = this;
        this.mainService.getVendorSubscriptions()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.vendorSubscriptions = data['data'];
                for (let i = 0; i < this.vendorSubscriptions.length; i++) {
                    if (this.vendorSubscriptions[i].startDate && this.vendorSubscriptions[i].startDate > 0 ) {
                        this.vendorSubscriptions[i].startDate = this.dateService.getDateString(this.vendorSubscriptions[i].startDate);
                    }
                    if (this.vendorSubscriptions[i].endDate && this.vendorSubscriptions[i].endDate > 0 ) {
                        this.vendorSubscriptions[i].endDate = this.dateService.getDateString(this.vendorSubscriptions[i].endDate);
                    }
                }
                $('#vendorSubscription').select2({
                    width: '100%'
                });
                $('#vendorSubscription').on('select2:select', function(e){
                    let selectId = e.params.data.id;
                    _self.selectVendorSubscriptions(selectId);
                });

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }


    selectVendorSubscriptions(vendorSubscriptionId) {
        for (let i = 0; i < this.vendorSubscriptions.length; i++) {
            if (this.vendorSubscriptions[i].id == vendorSubscriptionId) {
                this.selectedVendorSubscription = this.vendorSubscriptions[i];
            }
        }
    }

    loadProducts() {
        this.mainService.getProducts()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.products = data['data'];
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectProduct(productId) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == productId) {
                this.selectedProduct = this.products[i];
            }
        }
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

    loadCurrentVendor() {
        this.mainService.getCurrentVendorDetail()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.vendor = data['data'][0];
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadVendorProducts() {
        this.loading = true;
        this.mainService.getAllVendorProducts()
        .subscribe(
        data => {
            this.vendorProducts = data['data'][0];
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
