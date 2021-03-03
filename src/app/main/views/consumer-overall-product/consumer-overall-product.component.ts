import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ConsumerOverAllProduct',
  templateUrl: './consumer-overall-product.component.html',
  styleUrls: [],
})

export class ConsumerOverAllProductComponent {
    loading = false;
    selectedProductType: any = '';
    zone: any= {};
    topProductType: any= {};
    topProductTypes= [];
    totalProducts= [];
    currentUser= undefined;
    @Input () productTypes= [];
    @Input() client: any= {};
    @Input () dashboardDetail: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {
        let _self = this;
        setTimeout(function(){
            $('#consumerOverallSelect2').select2({
               width: '100%'
            });
            $('#consumerOverallSelect2').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedProductType = selectId;
                if (_self.selectedProductType.length > 5) {
                   _self.loadTopProductType();
                }

            });
        },1000);
        this.loadTopProductType();

    }

    getPercentageWith(value) {
        return 'width: \'' + value + '';
    }

    loadTopProductType( ) {
        /* this.mainService.getConsumerTopProductType(this.selectedProductType ? this.selectedProductType : '') */
        this.mainService.getConsumerTopProductType()
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
