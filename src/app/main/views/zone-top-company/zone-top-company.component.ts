import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ZoneTopCompany',
  templateUrl: './zone-top-company.component.html',
  styleUrls: [],
})

export class ZoneTopCompanyComponent {
    loading = false;
    zoneId:any={};
    zoneAdmin:any={};
    users= [];
    currentUser: any= {};
    topCompanies= [];
    steps: any= [];
    alias: any;
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
             this.loadTopCompany();
        },
        () => {
            this.loading = false;
        });
    }

    loadTopCompany() {
        this.mainService.getZoneAdminCompany(this.zoneAdmin.ownerId)
        .subscribe(
        data => {
            this.topCompanies = data['data'];
            var activeCompanies=[];
            for(let i=0; i<this.topCompanies.length; i++){
                 if(this.topCompanies[i].active){
                     activeCompanies.push(this.topCompanies[i])
                 }
            }
            this.topCompanies=activeCompanies;
        },
        () => {
            this.loading = false;
        });
    }
}
