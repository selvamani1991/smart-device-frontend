import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';



@Component({
    moduleId: module.id.toString(),
    templateUrl: 'forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
    CONFIG = APP_CONFIG;
    forgotUser: any = {};
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    loading = false;
    email = undefined;
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.FORGOT_PASSWORD_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.FORGOT_PASSWORD_DESC
    };
    constructor(
        private router: Router,
        private titleService: Title,
        private authenticationService: AuthenticationService,
        private translate: TranslateService,
        private alertService: AlertService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.FORGOT_PASSWORD_LINK));
    }

    ngOnInit() {
    }

    forgot(forgotUser) {
        this.loading = true;
        this.authenticationService.forgot(forgotUser)
            .subscribe(
            data => {
                if (!data['hasError']) {
                    localStorage.setItem('email', this.forgotUser.email);
                    this.router.navigate([this.AUTH_CONSTANTS.URL.FORGOT_PASSWORD_CONFIRMATION]);
                } else {
                    if (data['error'].errorCode === 7) {
                        this.loading = false;
                        this.alertService.error(data['error'].errorMessageCode);
                    }
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

    }

    forgotHelp() {
        $('#forgotHelpModal').modal();
    }
}
