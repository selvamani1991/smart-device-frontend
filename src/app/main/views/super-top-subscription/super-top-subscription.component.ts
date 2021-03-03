import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { CLIENT_CONSTANTS } from '../../../client/constants';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../../../consumer/consumer-product-type/constants';
import { CONSUMER_CONSTANTS } from '../../../consumer/constants';
import { SUBSCRIPTION_CONSTANTS } from '../../../subscription/constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'SuperTopSubscription',
  templateUrl: './super-top-subscription.component.html',
  styleUrls: [],
})

export class SuperTopSubscriptionComponent {
    superAdmin: any= {};
    loading = false;
    topSubscriptions= [];
    setting: any = {
        pageTitle: 'super-admin-dashboard.pageTitle',
        pageDesc: 'super-admin-dashboard.pageDesc'
    };
    steps: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CONSUMER_PRODUCT_TYPE_CONSTANTS= CONSUMER_PRODUCT_TYPE_CONSTANTS;
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    constructor(
                private titleService: Title,
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS = CONSUMER_PRODUCT_TYPE_CONSTANTS;
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);

    }

    ngOnInit() {
        this.loadTopSubscription();
    }

    loadTopSubscription( ) {
        this.mainService.getTopSubscription( )
        .subscribe(
        data => {
            this.topSubscriptions = data['data'];
            var activeSubscriptions=[];
            for(let i=0; i<this.topSubscriptions.length; i++){
                if(this.topSubscriptions[i].active){
                    activeSubscriptions.push(this.topSubscriptions[i])
                }
            }
            this.topSubscriptions=activeSubscriptions;

        },
        () => {
            this.loading = false;
        });
    }

}
