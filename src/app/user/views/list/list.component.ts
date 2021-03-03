import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { USER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    users: any = [];
    userTypes: any= [];
    userType: any= {};
    user: any= {};
    form: any= {};
    loading = false;
    currentUser = undefined;
    USER_CONSTANTS= USER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    alias: any= {};
    setting = {
        entity: USER_CONSTANTS.LABEL.USER,
        pageTitle: USER_CONSTANTS.LABEL.USER_LIST,
        pageDesc: USER_CONSTANTS.LABEL.USER_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.USER_CONSTANTS = USER_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_LIST_LINK, USER_CONSTANTS.URL.USER_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.USER_CONSTANTS.LABEL.USER);
        this.authenticationService.sessionChange$.subscribe(
            () => {
            this.currentUser = authenticationService.getCurrentUser();
            if (this.currentUser) {
                this.userTypes = [{id: this.currentUser.userType, name: this.currentUser.userType}];
            }
            this.loadUsers();
        });
    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        $('body').addClass('loading');
        this.userService.getAllUser(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.users = data['data'];
            this.paginationItems = this.users;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages =  reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();

        },
        error => {
            $('body').removeClass('loading');
            if (error.error.error.errorCode == ERROR_CODE.code_5) {
                this.alertService.error('auth.view.accessDenied', true);
                this.router.navigate([APP_CONFIG.DASHBOARD]);
            }else {
                this.alertService.error('auth.view.accessDenied', true);
            }
        });
    }

    changeStatus(user, status) {
        user.active = status;
        this.userService.updateUser(user)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == USER_CONSTANTS.FIELD.USER_NAME) {
                form.form.controls[USER_CONSTANTS.FIELD.USER_NAME].setErrors({'duplicate': true});
            }
        }
    }

    changePage(event) {
        this.currentPage = event;
        this.loadUsers();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadUsers();
    }

    reloadUsers() {
      this.loadUsers();
    }

    addUser() {
        this.router.navigate([USER_CONSTANTS.URL.USER_CREATE]);
    }

    show(user) {
        this.tooltipService.clear();
        this.router.navigate([USER_CONSTANTS.URL.USER_SHOW, user.alias]);
    }

    edit(user) {
        this.tooltipService.clear();
        this.router.navigate([USER_CONSTANTS.URL.USER_EDIT, user.alias]);
    }

    changePassword(user) {
        this.tooltipService.clear();
        this.router.navigate([USER_CONSTANTS.URL.USER_CHANGE_PASSWORD, user.alias]);
    }

    markDeleted(user) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, user);
    }

    remove(user) {
        this.userService.deleteUser(user.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
                this.loadUsers();
            }else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    searchUser(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadUsers();
        }else {
            this.query = '';
            this.loadUsers();
        }
    }

}
