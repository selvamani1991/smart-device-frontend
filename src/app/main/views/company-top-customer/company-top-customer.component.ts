import { Component, Input} from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'CompanyTopCustomer',
  templateUrl: './company-top-customer.component.html',
  styleUrls: [],
})
export class CompanyTopCustomerComponent {
    loading = false;
    @Input () company= [];
    @Input () client= [];
    topCompanyBuildings= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

    ngOnInit() {
        this.loadTopCompanyBuilding();
    }

    loadTopCompanyBuilding( ) {
        this.mainService.getTopCompanyBuilding()
        .subscribe(
        data => {
            this.topCompanyBuildings = data['data'];
            var activeCompanyBuildings=[];
            for(let i=0; i<this.topCompanyBuildings.length; i++){
                 if(this.topCompanyBuildings[i].active){
                     activeCompanyBuildings.push(this.topCompanyBuildings[i])
                 }
            }
            this.topCompanyBuildings=activeCompanyBuildings;
        },
        () => {
            this.loading = false;
        });
    }

}
