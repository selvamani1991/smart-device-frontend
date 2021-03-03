import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
    selector: 'DistributorTopProduct',
    templateUrl: './distributor-top-product.component.html',
    styleUrls: [],
})
export class DistributorTopProductComponent {
    loading = false;
    selectedZone: any = {id: 0};
    zone: any= {};
    @Input() zones= [];
    @Input() client= {};
    topDistributorProducts= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

     ngOnInit() {
        let _self = this;

        this.loadTopDistributorProduct();
         $('#productZone').select2({
             width: '100%'
         });
         $('#productZone').on('select21:select', function(e){
             let selectId = e.params.data.id;
             _self.selectZone(selectId);
         });
     }

     selectZone(zoneId) {
         for (let i = 0; i < this.zones.length; i++) {
             if (this.zones[i].id === zoneId) {
                 this.selectedZone = this.zones[i];
             }
         }
     }

     loadTopDistributorProduct( ) {
          this.mainService.getTopDistributorProduct( )
          .subscribe(
          data => {
              this.topDistributorProducts = data['data'];
              var activeDistributorProducts=[];
              for(let i=0; i<this.topDistributorProducts.length; i++){
                   if(this.topDistributorProducts[i].active){
                       activeDistributorProducts.push(this.topDistributorProducts[i])
                   }
              }
              this.topDistributorProducts=activeDistributorProducts;
          },
          () => {
              this.loading = false;
          });
     }


}
