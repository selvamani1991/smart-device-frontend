import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';

import { AUTH_VALIDATOR } from '../../validator';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    user: any = {};
    loading = false;
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    AUTH_VALIDATOR= AUTH_VALIDATOR;
    returnUrl: string;
    currentUser = undefined;
    APP_CONFIG = APP_CONFIG;
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.LOGIN_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.LOGIN_DESC
    };
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private translate: TranslateService,
        private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.AUTH_VALIDATOR = AUTH_VALIDATOR;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.LOGIN_LINK));
    }

    ngOnInit() {
        this.currentUser = this.authenticationService.getCurrentUser();
        if (this.currentUser != null) {
            this.router.navigate(['dashboard']);
        }
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.user.username, this.user.password)
            .subscribe(
            data => {
                if (data['hasError']) {
                    this.alertService.error(data['error'].errorMessageCode);
                } else {
                    this.currentUser = data['data'][0];
                    if (this.currentUser && this.currentUser.authToken) {
                        this.authenticationService.setCurrentUser(this.currentUser);
                    }
                    this.router.navigate([this.returnUrl]);
                }

            },
            error => {
                this.alertService.error(error.error.error.errorMessageCode);
                this.loading = false;
            });

    }
}
