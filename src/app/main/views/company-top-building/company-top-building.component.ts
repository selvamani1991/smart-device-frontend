import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'CompanyTopBuilding',
  templateUrl: './company-top-building.component.html',
  styleUrls: [],
})
export class CompanyTopBuildingComponent {
    loading = false;
    selectedZone: any = {id: 0};
    zone: any= {};
    @Input()zones= [];
    @Input()client= {};
    topCompanyBuildingProducts= [];
    topCompanyBuildings= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

    ngOnInit() {
            let _self = this;
        this.loadTopCompanyBuildingProduct();
        $('#companyBuildingsZone').select2({
            width: '100%'
        });
        $('#companyBuildingsZone').on('select2:select', function(e){
           let selectId = e.params.data.id;
          _self.selectedZone = selectId;
          if (_self.selectedZone.length > 5) {
               _self.loadTopCompanyBuildingProduct();
          }
        });
    }

    loadTopCompanyBuildingProduct( ) {
          this.mainService.getTopCompanyBuildingProduct( )
          .subscribe(
          data => {
              this.topCompanyBuildingProducts = data['data'];
              var activeCompanyBuildingProducts=[];
              for(let i=0; i<this.topCompanyBuildingProducts.length; i++){
                   if(this.topCompanyBuildingProducts[i].status=='Accepted' && this.topCompanyBuildingProducts[i].active){
                       activeCompanyBuildingProducts.push(this.topCompanyBuildingProducts[i])
                   }
              }
              this.topCompanyBuildingProducts=activeCompanyBuildingProducts;
          },
          () => {
              this.loading = false;
          });
    }

}

