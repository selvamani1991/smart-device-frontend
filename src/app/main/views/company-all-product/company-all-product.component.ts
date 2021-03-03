import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'CompanyAllProduct',
  templateUrl: './company-all-product.component.html',
  styleUrls: [],
})

export class CompanyAllProductComponent {
    loading = false;
    productType: any= {};
    topProductType: any= {};
    topProductTypes= [];
    currentUser= undefined;
    @Input () dashboardDetail: any= {};
    @Input() company: any= {};
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

         this.loadTopProductType();

     }

     getPercentageWith(value) {
         return 'width: \'' + value + '';
     }

      loadTopProductType( ) {
         this.mainService.getCompanyTopProductType()
         .subscribe(
         data => {
             this.topProductTypes = data['data'];
         },
         () => {
             this.loading = false;
         });
     }



}
