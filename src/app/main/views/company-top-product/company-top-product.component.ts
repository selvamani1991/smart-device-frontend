import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'CompanyTopProduct',
  templateUrl: './company-top-product.component.html',
  styleUrls: [],
})
export class CompanyTopProductComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    @Input() zones= [];
    @Input() client= [];
    topCompanyProducts= [];
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

    }

    ngOnInit() {
        this.loadTopCompanyProduct();
    }


    loadTopCompanyProduct( ) {
        this.mainService.getTopCompanyProducts(this.selectedZone )
        .subscribe(
        data => {
            this.topCompanyProducts = data['data'];
            var activeCompanyProducts=[];
            for(let i=0; i<this.topCompanyProducts.length; i++){
                 /*if(){
                     activeCompanyProducts.push(this.topCompanyProducts[i])
                 }*/
                 if(this.topCompanyProducts[i].status=='Accepted' && this.topCompanyProducts[i].active){
                      activeCompanyProducts.push(this.topCompanyProducts[i])
                 }
                 if(this.topCompanyProducts[i].status=='Assigned' && this.topCompanyProducts[i].active){
                    activeCompanyProducts.push(this.topCompanyProducts[i])
                }
            }
            this.topCompanyProducts=activeCompanyProducts;
        },
        () => {
            this.loading = false;
        });
    }

}
