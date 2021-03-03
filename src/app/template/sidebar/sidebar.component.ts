import { Component,Input } from '@angular/core';
import { APP_CONFIG } from '../../constants';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { MenuService } from '../../shared/services/menu.service';
import { AUTH_CONSTANTS } from '../../auth/constants';
import { USER_CONSTANTS } from '../../user/constants';
import { ProductTypeService } from '../../product-type/services/product-type.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent {
    currentUser = undefined;
    featureCategories = {others:[]};
    featureCategory = {};
    features= [];
    feature= [];
    nickNames={others:[]};
    resources = {others:[]};
    client: any= {};
    currentSubscriptions: any= {};
    menuType: any= 'default';
    loading = false;
    CONFIG= APP_CONFIG;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    USER_CONSTANTS= USER_CONSTANTS;
    constructor(
                private authenticationService: AuthenticationService,
                private productTypeService: ProductTypeService,
                private menuService: MenuService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
                if (this.currentUser) {
                    this.loadClient();
                }
                this.features = this.menuService.getFeatures();

            });
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.resources = this.menuService.getMenu(this.currentUser.userType,this.client);
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                if(!this.client.media){
                   this.deleteMenu(8, 1);
                }
                if(!this.client.fota){
                     this.deleteMenu(8, 2);
                }
                if(!this.client.qrCode){
                     this.deleteMenu(8, 3);
                }

            }
            this.featureCategories=this.resources;
            if(this.currentUser.userType=='clientAdmin'){
                this.loadSubscription();
            }

        },
        () => {
          this.loading = false;
        });
    }

    deleteMenu(featureCategory, feature){
        for(var i=0;i< this.resources.others.length;i++){
            if(featureCategory == this.resources.others[i].id){
                for(var j=0;j<this.resources.others[i].features.length;j++){
                    if(feature == this.resources.others[i].features[j].id){
                         this.resources.others[i].features.splice(j,1);
                         this.resources.others[i].menus.splice(j,1);
                    }
                }
            }
        }
    }

    deletedMainMenu(featureCategory){
        for(var i=0;i< this.featureCategories.others.length;i++){
            if(featureCategory == this.featureCategories.others[i].id){
                this.featureCategories.others.splice(i,1);
            }
        }
    }

    loadSubscription() {
        var _self = this;
        this.productTypeService.getSubscription()
        .subscribe(
        data => {
            this.currentSubscriptions = data['data'];
            let consumerProductSupported = false;
            for(let i=0; i<this.currentSubscriptions.length; i++){
                if(this.currentSubscriptions[i].subscription.productCategory.consumerProductSupported){
                    consumerProductSupported = true; break;
                }
            }
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                if(!consumerProductSupported){
                    this.deletedMainMenu(1);
                    this.deletedMainMenu(5);
                }
            }
            this.featureCategories=this.resources;

        },
        () => {
            this.loading = false;
        });
    }

}
