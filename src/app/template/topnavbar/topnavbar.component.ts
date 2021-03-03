import { Component} from '@angular/core';
import { APP_CONFIG } from '../../constants';
import { MAIN_CONSTANTS } from '../../main/constants';
import { USER_CONSTANTS } from '../../user/constants';
import { AUTH_CONSTANTS } from '../../auth/constants';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { Router } from '@angular/router';

import { UserService } from '../../user/services/user.service';
import { HttpResponseService } from '../../shared/services/http-response.service';

import { CLIENT_CONSTANTS } from '../../client/constants';
import { COMPANY_CONSTANTS } from '../../company/constants';
import { VENDOR_CONSTANTS } from '../../vendor/constants';
import { DISTRIBUTOR_CONSTANTS } from '../../distributor/constants';

@Component({
  selector: 'top-navbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: []
})

export class TopNavbarComponent {
    loading = false;
    currentUser = undefined;
    user: any= {};
    alias: any= {};
    currentOwner: any= {};
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    USER_CONSTANTS= USER_CONSTANTS;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private httpResponseService: HttpResponseService,
    ) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
            if (this.currentUser) {
                this.loadUser(this.currentUser.alias);
            }
            if (this.currentUser && this.currentUser.ownerId) {
                this.loadCurrentAdmin(this.currentUser.ownerId);
            }
        });
    }

    ngOnInit(): void {
        $('.nav-control').on('click', function() {
            $('#main-wrapper').toggleClass('menu-toggle');
            $('.hamburger').toggleClass('is-active');
            $('.nav-label').toggle();
        });
    }

    logout() {
        this.authenticationService.logout().subscribe(
            data => {
                if (!data['hasError']) {
                    // remove user from local storage to log user out
                }
            },
            () => {
            });
        localStorage.removeItem('currentUser');
        $('#app').addClass('app-page-navbar-fixed');
        this.authenticationService.setCurrentUserNull();
        this.router.navigate([AUTH_CONSTANTS.URL.LOGIN]);
    }

    changePassword() {
        this.router.navigate([AUTH_CONSTANTS.URL.CHANGE_PASSWORD, this.currentUser.alias]);
    }

    /*  subscription() {
        this.router.navigate([AUTH_CONSTANTS.URL.SUBSCRIPTION]);
    } */

    subscription() {
        if(this.currentUser && this.currentUser.userType == 'clientAdmin'){
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_CLIENT_SUBSCRIPTION_LIST,this.currentUser.ownerId]);
        }
        if(this.currentUser && this.currentUser.userType == 'companyAdmin'){
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_SUBSCRIPTION_LIST,this.currentUser.ownerId]);
        }
        if(this.currentUser && this.currentUser.userType == 'vendorAdmin'){
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST,this.currentUser.ownerId]);
        }
        if(this.currentUser && this.currentUser.userType == 'distributorAdmin'){
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST,this.currentUser.ownerId]);
        }

    }

    loadUser(alias) {
        this.userService.getUser(alias)
        .subscribe(
        data => {
            this.user = data['data'][0];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadCurrentAdmin(alias) {
        this.userService.getCurrentAdminImage(alias, this.currentUser.userType)
        .subscribe(
        data => {
            this.currentOwner = data['data'][0];

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }
}
