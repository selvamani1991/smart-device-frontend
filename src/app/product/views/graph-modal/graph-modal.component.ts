import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {PRODUCT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';

@Component({
    selector: 'graph-modal',
    moduleId: module.id.toString(),
    templateUrl: 'graph-modal.component.html'
})

export class GraphModalComponent implements OnInit {

    @Input() product;
    @Input() productData;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    constructor(
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
          this.ERROR_CODE = ERROR_CODE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT_DATA_LIST);
    }

    ngOnInit() {
    }
}
