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
    templateUrl: 'reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
    registerUser: any = {};
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    loading = false;
    token = '';
    alias = '';
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.RESET_PASSWORD_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.RESET_PASSWORD_DESC
    };
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private translate: TranslateService
        ) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.RESET_PASSWORD_LINK));
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.alias = params['alias'];
            this.token = params['token'];
        });
    }

    pwmatch(registerUser) {
        return !(registerUser.password === registerUser.confirmPassword);
    }

    resetPassword(registerUser, f) {
        this.loading = true;
        var registerUserCopy = JSON.parse(JSON.stringify(registerUser));
        delete registerUserCopy.confirmPassword;
        registerUserCopy.alias = this.alias;
        registerUserCopy.token = this.token;
        this.authenticationService.resetPassword(registerUserCopy)
            .subscribe(
            data => {
                if (!data['hasError']) {
                    this.router.navigate([this.AUTH_CONSTANTS.URL.PASSWORD_RESET]);
                } else {
                    this.alertService.error(data['error'].errorMessageCode);
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

}
