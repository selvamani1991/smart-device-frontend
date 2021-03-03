import { Component, OnInit } from '@angular/core';

import { APP_CONFIG } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';


@Component({
    selector: 'privacy-content-modal',
    moduleId: module.id.toString(),
    templateUrl: 'privacy-content-modal.component.html'
})

export class PrivacyContentModalComponent implements OnInit {
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    currentUser = undefined;
    constructor() {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
    }

    ngOnInit() {
    }
}
