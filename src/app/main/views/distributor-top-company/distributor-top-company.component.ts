import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
    selector: 'DistributorTopCompany',
    templateUrl: './distributor-top-company.component.html',
    styleUrls: [],
})

export class DistributorTopCompanyComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    @Input()zones= [];
    @Input()client= {};
    topCompanies= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

     ngOnInit() {
         let _self = this;
         $('#companyZone').select2({
            width: '100%'
         });
         $('#companyZone').on('select2:select', function(e){
               let selectId = e.params.data.id;
               _self.selectedZone = selectId;
               if (_self.selectedZone.length > 5) {
                    _self.loadTopCompany();
               }

         });
         this.loadTopCompany();
     }

     loadTopCompany( ) {
          this.mainService.getTopCompanies(this.selectedZone)
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
