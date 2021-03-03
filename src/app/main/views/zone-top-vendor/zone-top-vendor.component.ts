import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ZoneTopVendor',
  templateUrl: './zone-top-vendor.component.html',
  styleUrls: [],
})

export class ZoneTopVendorComponent {
    loading = false;
    users= [];
    zoneAdmin:any={};
    topVendors= [];
    steps: any= [];
    alias: any;
    currentUser: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private mainService: MainService,
                private authenticationService: AuthenticationService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.loadZones();
    }

    loadZones() {
        this.mainService.getCurrentVendorDetail()
        .subscribe(
        data => {
             this.zoneAdmin = data['data'][0];
             this.loadTopVendor();
        },
        () => {
            this.loading = false;
        });
    }

    loadTopVendor( ) {
        this.mainService.getZoneAdminVendor(this.zoneAdmin.ownerId)
        .subscribe(
        data => {
            this.topVendors = data['data'];
            var activeVendors=[];
            for(let i=0; i<this.topVendors.length; i++){
                 if(this.topVendors[i].active){
                     activeVendors.push(this.topVendors[i])
                 }
            }
            this.topVendors=activeVendors;
        },
        () => {
            this.loading = false;
        });
    }
}
