import { Component, Output, EventEmitter } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'search-header',
  templateUrl: './search-header.component.html',
  styleUrls: []
})
export class SearchHeaderComponent {
    pageSizeList = ['1', '4', '8', '12', '20', '40', '100'];
    pageSizeSelect= 8;
    @Output() pageSizeChanged = new EventEmitter<number>();
    @Output() search = new EventEmitter<number>();
    @Output() searchDate = new EventEmitter<number>();
    date: any= {};

    constructor() {
    }

    changePageSize(pageChange) {
        this.pageSizeSelect = pageChange;
        this.pageSizeChanged.emit(this.pageSizeSelect);
    }

    valueChange(newValue) {
        this.search.emit(newValue);
    }
    dateSearch() {
        this.searchDate.emit(this.date);
    }
}
