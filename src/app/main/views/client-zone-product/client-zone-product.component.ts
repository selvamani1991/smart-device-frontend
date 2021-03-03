import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ClientZoneProduct',
  templateUrl: './client-zone-product.component.html',
  styleUrls: [],
})
export class ClientZoneProductComponent {
    loading = false;
    selectedProductType: any = '';
    productType: any= {};
    @Input () productTypes= [];
    @Input () client: any= {};
    zoneProductTypes: any= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {
        let _self = this;
        $('#selectZoneProductType').select2({
           width: '100%'
        });
        $('#selectZoneProductType').on('select2:select', function(e){
           let selectId = e.params.data.id;
           _self.selectedProductType = selectId;
           if (_self.selectedProductType.length > 5) {
              _self.loadZoneProductType();
           }

        });
        this.loadZoneProductType( );
    }

    getPercentageWith(value) {
        return 'width: \'' + value + '';
    }

    loadZoneProductType( ) {
        this.mainService.getZoneProductType(this.selectedProductType ? this.selectedProductType : ' ')
        .subscribe(
        data => {
            this.zoneProductTypes = data['data'];
        },
        () => {
            this.loading = false;
        });
    }

    totalProduct() {
        let total = 0;
        for (let i = 0; i < this.zoneProductTypes.length; i++) {
            total = total + this.zoneProductTypes[i].count;
        }
        return total;
    }

}
