import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAIN_CONSTANTS } from '../../main/constants';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'page-title',
  templateUrl: './page-title.component.html',
  styleUrls: []
})
export class PageTitleComponent implements OnInit {
    @Input() setting: any;
    @Input() steps: any;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor() {
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {

    }
}
