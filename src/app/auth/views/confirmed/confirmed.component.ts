import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'confirmed.component.html'
})

export class ConfirmedComponent implements OnInit {
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    currentUser = undefined;
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.CONFIRMED_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.CONFIRMED_DESC
    };
    constructor(
        private titleService: Title, private translate: TranslateService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.translate.instant(this.AUTH_CONSTANTS.LABEL.CONFIRMED_LINK));
    }

    ngOnInit() {
    }
}
