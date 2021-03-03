import { Component, Output, EventEmitter } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import { CompanyService} from '../../company/services/company.service';
// import { COMPANY_CONSTANTS } from '../../company/constants';
// import { BuildingService} from '../../building/services/building.service';
// import { BUILDING_CONSTANTS } from '../../building/constants';

@Component({
  selector: 'response-header',
  templateUrl: './response-header.component.html',
  styleUrls: []
})
export class ResponseHeaderComponent {
    loading = false;
    pageSizeList = ['1', '4', '8', '12', '20', '40', '100'];
    pageSizeSelect= 8;
    @Output() pageSizeChanged = new EventEmitter<number>();
    @Output() search = new EventEmitter<number>();
    @Output() company= new EventEmitter<number>();
    @Output() building= new EventEmitter<number>();
    date: any= {};
    companies= [];
    buildings= [];
    selectedCompanyId;
    selectedBuildingId;
     constructor(
      // private companyService:CompanyService,
        // private buildingService: BuildingService,
       private translateService: TranslateService) {

        }



   /* changePageSize(pageChange){
        this.pageSizeSelect=pageChange;
        this.pageSizeChanged.emit(this.pageSizeSelect);
    }

    valueChange(newValue)
    {
        this.search.emit(newValue);
    }
    selectCompany(selectedCompanyId)
    {
        this.company.emit(selectedCompanyId);
    }
    selectBuilding(selectedBuildingId)
    {
        this.building.emit(selectedBuildingId);
    }
    ngOnInit() {
           this.loadCompanies();
           this.loadBuildings();
    }
    loadCompanies(){
          //this.companyService.getCompanies()
           .subscribe(
           data => {
               if (!data['hasError']) {
                 this.companies=data["data"];
                 this.selectedCompanyId=this.companies[0].id;
                 this.company.emit(this.selectedCompanyId);

               }
               this.loading = false;
           },
           error => {
             this.loading = false;
           });
    }
    loadBuildings(){
          this.buildingService.getBuildings()
           .subscribe(
           data => {
               if (!data['hasError']) {
                 this.buildings=data["data"];
               }
               this.loading = false;
           },
           error => {
             this.loading = false;
           });
    }*/

}
