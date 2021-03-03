import { Component, OnInit } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';


@Component({
    selector: 'forgot-help-modal',
    moduleId: module.id.toString(),
    templateUrl: 'forgot-help-modal.component.html'
})

export class ForgotHelpModalComponent implements OnInit {
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
