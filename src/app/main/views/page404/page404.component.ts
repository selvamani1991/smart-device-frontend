import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';

@Component({
  selector: 'page404-root',
  templateUrl: './page404.component.html',
  styleUrls: []
})
export class Page404Component {
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.PAGE404_LINK);
    }
}
