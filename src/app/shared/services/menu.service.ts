import { Injectable ,Input} from '@angular/core';
import { Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

import { SUPER_ADMIN_MENU_CONSTANTS } from '../../menu/super-admin-menu';
import { BOARD_ADMIN_MENU_CONSTANTS } from '../../menu/board-admin-menu';
import { VENDOR_ADMIN_MENU_CONSTANTS } from '../../menu/vendor-admin-menu';
import { MANUFACTURER_ADMIN_MENU_CONSTANTS } from '../../menu/manufacturer-admin-menu';
import { DISTRIBUTOR_ADMIN_MENU_CONSTANTS } from '../../menu/distributor-admin-menu';
import { COMPANY_ADMIN_MENU_CONSTANTS } from '../../menu/company-admin-menu';
import { CLIENT_ADMIN_MENU_CONSTANTS } from '../../menu/client-admin-menu';
import { CLIENT_TWO_ADMIN_MENU_CONSTANTS } from '../../menu/client-two-admin-menu';
//import { ZONE_ADMIN_MENU_CONSTANTS } from '../../menu/zone-admin-menu';
import { COMPANY_BUILDING_ADMIN_MENU_CONSTANTS } from '../../menu/company-building-admin-menu';
import { USER_TYPES } from '../../menu/constants';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { ProductTypeService } from '../../product-type/services/product-type.service';
@Injectable()
export class MenuService {
    selectedMenu= {};
    client:any={};
    loading = false;
    currentUser= undefined;
    SUPER_ADMIN_MENU_CONSTANTS= SUPER_ADMIN_MENU_CONSTANTS;
    constructor(
        private router: Router,
        private productTypeService: ProductTypeService,
        private authenticationService: AuthenticationService,
        private translate: TranslateService) {
            this.SUPER_ADMIN_MENU_CONSTANTS = SUPER_ADMIN_MENU_CONSTANTS;
            this.authenticationService.sessionChange$.subscribe(
                () => {
                    this.currentUser = authenticationService.getCurrentUser();
                }
            );
    }

    ngOnInit() {
    }

    getMenuByType(type,client) {
        if (!type) {
            this.selectedMenu = SUPER_ADMIN_MENU_CONSTANTS;
            return;
        }
        if (USER_TYPES.SUPER_ADMIN == type) {
            this.selectedMenu = SUPER_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.BOARD_ADMIN == type) {
            this.selectedMenu = BOARD_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.VENDOR_ADMIN == type) {
            this.selectedMenu = VENDOR_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.MANUFACTURER_ADMIN == type) {
            this.selectedMenu = MANUFACTURER_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.DISTRIBUTOR_ADMIN == type) {
                    this.selectedMenu = DISTRIBUTOR_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.COMPANY_ADMIN == type) {
            this.selectedMenu = COMPANY_ADMIN_MENU_CONSTANTS;
        } else if (USER_TYPES.COMPANY_BUILDING_ADMIN == type) {
            this.selectedMenu = COMPANY_BUILDING_ADMIN_MENU_CONSTANTS;
        }
        /*else if (USER_TYPES.ZONE_ADMIN == type) {
            this.selectedMenu = ZONE_ADMIN_MENU_CONSTANTS;
        }*/else if(USER_TYPES.CLIENT_ADMIN == type ){
            if(client && client.distributorSupported ){
                this.selectedMenu = CLIENT_ADMIN_MENU_CONSTANTS;
            }else{
                this.selectedMenu = CLIENT_TWO_ADMIN_MENU_CONSTANTS;
            }
        }
    }
    getMenu(type,client) {
        this.getMenuByType(type,client);
        if (this.selectedMenu) {
            // @ts-ignore
            this.generateMenu(this.selectedMenu.featureCategories['others']);
        }
        // @ts-ignore
        return this.selectedMenu.featureCategories;
    }

    getFeatures() {
        // @ts-ignore
        return this.selectedMenu.features;
    }

    generateMenu(categories) {
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].features.length > 0) {
                    categories[i].menus = [];
                    for (let j = 0; j < categories[i].features.length; j++) {
                        var menu = JSON.parse(JSON.stringify(categories[i].features[j]));
                        categories[i].menus.push(menu);
                    }
                }
            }
        }
    }

}
