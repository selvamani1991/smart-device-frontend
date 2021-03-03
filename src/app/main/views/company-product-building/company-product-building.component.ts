import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
  selector: 'CompanyProductBuilding',
  templateUrl: './company-product-building.component.html',
  styleUrls: [],
})

export class CompanyProductBuildingComponent {
    loading = false;
    selectedZone: any = {id: 0};
    zone: any= {};
    @Input()zones= [];
    topCompanyBuildingProducts= [];
    topCompanyBuildingProductTypes= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private router: Router,
    private mainService: MainService,
    private sweetAlertService: SweetAlertService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {
            let _self = this;
        this.loadTopCompanyBuildingProductType();
        $('#buildingProductZone').select2({
            width: '100%'
        });
        $('#buildingProductZone').on('select2:select', function(e){
           let selectId = e.params.data.id;
          _self.selectedZone = selectId;
          if (_self.selectedZone.length > 5) {
               _self.loadTopCompanyBuildingProductType();
          }
        });
    }

    loadTopCompanyBuildingProductType( ) {
          this.mainService.getTopCompanyBuildingProductType( )
          .subscribe(
          data => {
              this.topCompanyBuildingProductTypes = data['data'];
               /* var activeCompanyBuildingProducts=[];
               for(let i=0; i<this.topCompanyBuildingProducts.length; i++){
                     if(this.topCompanyBuildingProducts[i].active && this.topCompanyBuildingProducts[i].status=='Accepted'){
                         activeCompanyBuildingProducts.push(this.topCompanyBuildingProducts[i])
                     }
               }
               this.topCompanyBuildingProducts=activeCompanyBuildingProducts; */
          },
          error => {
              this.sweetAlertService.notSuccessful(error.message);
              this.router.navigate([MAIN_CONSTANTS.URL.DASHBOARD]);
              this.loading = false;
          });
    }

}
