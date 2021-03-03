import { Component, Input, Output, EventEmitter  } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: []
})
export class PaginationComponent {
    @Input() totalSize: any;
    @Input() currentPage: any;
    @Input() pageSize: any;
    @Input() itemSize: any;
    @Input() totalPages: any;
    @Output() pageChanged = new EventEmitter<number>();
    constructor() {
    }

    getNumber() {
        var pages = new Array();
        var start = this.currentPage > 3 ? this.currentPage - 3 : 1;
        var end = this.totalPages - this.currentPage > 3 ? this.currentPage + 3 : this.totalPages;
        for (var i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    getPage(page) {
        this.currentPage = page;
        this.pageChanged.emit(this.currentPage);
     //   scope.list();
    }

    previousPage() {
        this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
        this.pageChanged.emit(this.currentPage);
    }

    nextPage() {
        this.currentPage = this.currentPage < this.totalPages ? this.currentPage + 1 : this.currentPage;
        this.pageChanged.emit(this.currentPage);
    }
}
