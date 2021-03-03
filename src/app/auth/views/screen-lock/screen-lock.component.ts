import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';
import { UserService } from '../../../user/services/user.service';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'screen-lock.component.html'
})

export class ScreenLockComponent implements OnInit {
    user: any = {};
    loading = false;
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    currentUser = undefined;
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private titleService: Title) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.AUTH_CONSTANTS.LABEL.SCREEN_LOCK);
        value => {
            this.currentUser = authenticationService.getCurrentUser();
            if (this.currentUser) {
                this.loadUser(this.currentUser.alias);
            }
        }
    }

    ngOnInit() {
        this.currentUser = this.authenticationService.getCurrentUser();
    }

    unlock() {
        this.loading = true;
        this.user.username = this.currentUser.username;
        this.authenticationService.login(this.user.username, this.user.password)
        .subscribe(
        data => {
            this.currentUser = data['data'][0];
            if (this.currentUser && this.currentUser.authToken) {
                this.authenticationService.setCurrentUser(this.currentUser);
            }
            this.router.navigate([this.AUTH_CONSTANTS.URL.DASHBOARD]);
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    loadUser(alias) {
        this.userService.getUser(alias)
        .subscribe(
        data => {
            this.user = data['data'][0];
        },
        failure => {
            this.loading = false;
        });
    }
}
