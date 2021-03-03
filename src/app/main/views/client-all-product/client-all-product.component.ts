import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ClientAllProduct',
  templateUrl: './client-all-product.component.html',
  styleUrls: [],
})

export class ClientAllProductComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    topProductType: any= {};
    topProductTypes= [];
    totalProducts= [];
    currentUser= undefined;
    @Input() zones;
    @Input() client: any= {};
    @Input() vendor: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
                private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {
        let _self = this;
        $('#allProduct').select2({
           width: '100%'
        });
        $('#allProduct').on('select2:select', function(e){
            let selectId = e.params.data.id;
            _self.selectedZone = selectId;
            if (_self.selectedZone.length > 5) {
               _self.loadTopProductType();
            }

        });
        this.loadTopProductType();

    }

    getPercentageWith(value) {
        return 'width: \'' + value + '';
    }

    loadTopProductType( ) {
        this.mainService.getClientTopProductType(this.selectedZone ? this.selectedZone : '')
        .subscribe(
        data => {
            this.topProductTypes = data['data'];
        },
        () => {
            this.loading = false;
        });
    }

    totalProduct() {
        let total = 0;
        for (let i = 0; i < this.topProductTypes.length; i++) {
            total = total + this.topProductTypes[i].count;
        }
        return total;
    }
}
