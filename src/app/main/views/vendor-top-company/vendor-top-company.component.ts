import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'VendorTopCompany',
  templateUrl: './vendor-top-company.component.html',
  styleUrls: [],
})
export class VendorTopCompanyComponent {
    loading = false;
    selectedProduct: any = '';
    product: any= {};
    @Input () products= [];
    @Input () client= [];
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
        $('#vendor-top-company').select2({
            width: '100%'
        });
        $('#vendor-top-company').on('select2:select', function(e){
            let selectId = e.params.data.id;
               _self.selectedProduct = selectId;
               if (_self.selectedProduct.length > 5) {
                    _self.loadTopCompany();
            }
        });
        this.loadTopCompany();
    }


    loadTopCompany( ) {
        this.mainService.getTopCompany(this.selectedProduct)
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
