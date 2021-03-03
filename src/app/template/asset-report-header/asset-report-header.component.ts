import { Component, Output, EventEmitter } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import { CompanyService} from '../../company/services/company.service';
// import { COMPANY_CONSTANTS } from '../../company/constants';

@Component({
  selector: 'asset-report-header',
  templateUrl: './asset-report-header.component.html',
  styleUrls: []
})
export class AssetReportHeaderComponent {
    loading = false;
    pageSizeList = ['1', '4', '8', '12', '20', '40', '100'];
    pageSizeSelect= 8;
    @Output() pageSizeChanged = new EventEmitter<number>();
    @Output() search = new EventEmitter<number>();
    @Output() company= new EventEmitter<number>();
    companies= [];
    selectedCompanyId;
    constructor(
    // private companyService:CompanyService
    ) {

    }

    changePageSize(pageChange) {
        this.pageSizeSelect = pageChange;
        this.pageSizeChanged.emit(this.pageSizeSelect);
    }

    valueChange(newValue) {
            this.search.emit(newValue);
    }
    selectCompany(selectedCompanyId) {
        this.company.emit(selectedCompanyId);
    }
    ngOnInit() {
          // this.loadCompanies();
    }
   /*loadCompanies(){
          this.companyService.getCompanies()
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
    }*/
}
