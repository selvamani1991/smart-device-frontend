import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { Router } from '@angular/router';

import { SUCCESS_CODE } from '../../../constants';

import { UserService } from '../../../user/services/user.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';

import { DateService } from '../../../shared/services/date.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertService } from '../../../shared/services/alert.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'my-profile.component.html'
})

export class MyProfileComponent implements OnInit {
    loading = false;
    currentUser = undefined;
    files: any= [];
    user: any= {};
    steps= [];
    formatError = false;
    CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    SUCCESS_CODE= SUCCESS_CODE;
    setting = {
        entity: AUTH_CONSTANTS.LABEL.USER_IMAGE,
        pageTitle: AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.MY_PROFILE_DESC
    };
    constructor(
    private titleService: Title,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private httpResponseService: HttpResponseService,
    private userService: UserService,
    private alertService: AlertService,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private dateService: DateService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        breadCrumService.pushStep(AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK, AUTH_CONSTANTS.URL.MY_PROFILE, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK));
        this.authenticationService.sessionChange$.subscribe(
        value => {
        this.currentUser = authenticationService.getCurrentUser();
        if (this.currentUser) {
            this.currentUser.dateOfBirthFormatted = this.dateService.getDateString(this.currentUser.dateOfBirth);
        }
        if (this.currentUser) {
            this.loadUser(this.currentUser.alias);
        }
    });
    }

    ngOnInit() {
    }

    onFileChange(event) {
           this.files = event.target.files[0];
           var pattern = /image-*/;
           if (!this.files.type.match(pattern)) {
               this.formatError = true;
               return;
           } else {
               this.formatError = false;
           }
           this.processFile();
    }

    processFile() {
        this.userService.uploadImage(this.files, this.user.id)
        .subscribe(
        data => {
            this.user = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
        this.sweetAlertService.notSuccessful(error.message);
    });
    }

    loadUser(alias) {
        this.userService.getUser(alias)
        .subscribe(
        data => {
            this.user = data['data'][0];
            this.user.dateOfBirth = this.dateService.getDateString(this.user.dateOfBirth);

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    markDeleted(user) {
        this.sweetAlertService.deleteCheck(this, user);
    }

    remove(user) {
        user.avatar=null;
        delete user.dateOfBirth;
        this.userService.deleteProfilePicture(user)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    edit(user){
        this.router.navigate([AUTH_CONSTANTS.URL.EDIT_PROFILE, user.alias]);
    }

}
