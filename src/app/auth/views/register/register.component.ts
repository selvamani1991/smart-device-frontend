import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router} from '@angular/router';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    registerUser: any = {};
    emailAlreadyRegistered = false;
    loading = false;
    APP_CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;

    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.REGISTER_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.REGISTER_DESC
    };
    constructor(
        private router: Router,
        private titleService: Title,
        private authenticationService: AuthenticationService,
        private translate: TranslateService,
        private alertService: AlertService
        ) {
        this.APP_CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.REGISTER_LINK));

    }

    register(registerUser, f) {
        this.loading = true;
        if (this.mustAgree(registerUser)) {
            this.authenticationService.register(registerUser)
                .subscribe(
                data => {
                    if (!data['hasError']) {
                        this.router.navigate([this.AUTH_CONSTANTS.URL.REGISTERED]);
                    } else {
                        if (data['error'].errorCode === 16) {
                            this.emailAlreadyRegistered = true;
                            // f.form.controls['email'].setErrors({'incorrect': true});
                            this.loading = false;
                        }
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }

    }

    privacy() {
        $('#privacyContentModal').modal();
    }

    pwmatch(registerUser) {
        return !(registerUser.password === registerUser.confirmPassword);
    }

    validateEmail(registerUser) {
        var regX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return !(registerUser.email && regX.test(registerUser.email));

    }

    mustAgree(registerUser) {
        return registerUser.agree;
    }
}
