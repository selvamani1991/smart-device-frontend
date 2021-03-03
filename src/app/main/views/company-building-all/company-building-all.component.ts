import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';

@Component({
  selector: 'CompanyBuildingAll',
  templateUrl: './company-building-all.component.html',
  styleUrls: [],
})

export class CompanyBuildingAllComponent {
    loading = false;
    selectedProductType: any = {id: 0};
    productType: any= {};
    topProductType: any= {};
    topProductTypes= [];
    companyBuildings= [];
    currentUser= undefined;
    @Input() productTypes;
    @Input() companyBuilding: any= {};
    @Input() client: any= {};
    @Input() dashboardDetail: any= {};
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

    totalProduct() {
        let total = 0;
        for (let i = 0; i < this.topProductTypes.length; i++) {
            total = total + this.topProductTypes[i].count;
        }
        return total;
    }



}
