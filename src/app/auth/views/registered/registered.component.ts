import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'registered.component.html'
})

export class RegisteredComponent implements OnInit {
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    currentUser = undefined;
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.REGISTERED_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.REGISTERED_DESC
    };

    constructor(
        private titleService: Title,
        private translate: TranslateService
        ) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.REGISTERED_LINK));
    }

    ngOnInit() {
    }
}
