import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;


@Component({
  selector: 'product-list-header',
  templateUrl: './product-list-header.component.html',
  styleUrls: []
})
export class ProductListHeaderComponent implements OnInit {
    pageSizeList = ['1', '4', '8', '12', '20', '40', '100'];
    pageSizeSelect= 8;
    @Output() pageSizeChanged = new EventEmitter<number>();
    @Output() search = new EventEmitter<number>();
    constructor() {
    }

    ngOnInit() {
        var _self = this;
        $('#product-list-header').select2({
            width: '25%'
        });
        $('#product-list-header').on('select2:select', function(e){
            var pageChange = e.params.data.id;
            _self.changePageSize(pageChange);
        });
    }

    changePageSize(pageChange) {
        this.pageSizeSelect = pageChange;
        this.pageSizeChanged.emit(this.pageSizeSelect);
    }


    valueChange(newValue){
        this.search.emit(newValue);
    }
}
