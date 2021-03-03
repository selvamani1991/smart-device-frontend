import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { EXTERNAL_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';

@Component({
  selector: 'about-root',
  templateUrl: './about.component.html',
  styleUrls: []
})
export class AboutComponent {
    EXTERNAL_CONSTANTS= EXTERNAL_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    setting = {
        pageTitle: EXTERNAL_CONSTANTS.LABEL.ABOUT_LINK,
        pageDesc: EXTERNAL_CONSTANTS.LABEL.ABOUT_DESC
    };
    constructor(private titleService: Title, private translate: TranslateService) {
        this.EXTERNAL_CONSTANTS = EXTERNAL_CONSTANTS;
        this.APP_CONFIG = APP_CONFIG;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.translate.instant(EXTERNAL_CONSTANTS.LABEL.ABOUT_LINK));
    }
}
