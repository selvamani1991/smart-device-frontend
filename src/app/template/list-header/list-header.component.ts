import { Component, Output, EventEmitter , OnInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'list-header',
  templateUrl: './list-header.component.html',
  styleUrls: []
})
export class ListHeaderComponent implements OnInit {
    pageSizeList = ['1', '4', '8', '12', '20', '40', '100'];
    pageSizeSelect= 8;
    @Output() pageSizeChanged = new EventEmitter<number>();
    @Output() addNewEvent = new EventEmitter<number>();
    @Output() search = new EventEmitter<number>();
    constructor() {
    }

    ngOnInit() {
        var _self = this;
        $('#list-header').select2({
            width: '25%'
        });
        $('#list-header').on('select2:select', function(e){
            var pageChange = e.params.data.id;
            _self.changePageSize(pageChange);
        });
    }

    changePageSize(pageChange) {
        this.pageSizeSelect = pageChange;
        this.pageSizeChanged.emit(this.pageSizeSelect);

    }

    addNew() {
        this.addNewEvent.emit(1);
    }

    valueChange(newValue) {
        this.search.emit(newValue);
    }
}
