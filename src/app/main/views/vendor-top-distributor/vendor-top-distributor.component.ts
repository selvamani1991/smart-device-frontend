import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'VendorTopDistributor',
  templateUrl: './vendor-top-distributor.component.html',
  styleUrls: [],
})
export class VendorTopDistributorComponent {
    loading = false;
    selectedProduct: any = '';
    product: any= {};
    @Input()products= [];
    @Input()client= [];
    topDistributors= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

    ngOnInit() {
        let _self = this;
        $('#allVendorDistributorZone').select2({
            width: '100%'
        });
        $('#allVendorDistributorZone').on('select2:select', function(e){
           let selectId = e.params.data.id;
           _self.selectedProduct = selectId;
           if (_self.selectedProduct.length > 5) {
               _self.loadTopDistributor();
           }

           });
           this.loadTopDistributor();
    }



    loadTopDistributor( ) {
        this.mainService.getTopDistributor(this.selectedProduct)
        .subscribe(
        data => {
            this.topDistributors = data['data'];
            var activeDistributors=[];
            for(let i=0; i<this.topDistributors.length; i++){
                 if(this.topDistributors[i].active){
                     activeDistributors.push(this.topDistributors[i])
                 }
            }
            this.topDistributors=activeDistributors;
        },
        () => {
            this.loading = false;
        });
    }

}
