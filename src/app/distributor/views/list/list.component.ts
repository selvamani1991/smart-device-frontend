import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorService } from '../../services/distributor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    distributors: any = [];
    distributor: any= {};
    client: any= {};
    currentUser=undefined;
    services= [];
    form: any= {};
    loading = false;
    active= false;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_LIST,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private distributorService: DistributorService,
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.loadDistributor();
        this.loadClient();
    }

    loadDistributor() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorService.getAllDistributors(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributors = data['data'];
            this.paginationItems = this.distributors;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();

        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadDistributor();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadDistributor();
    }

    addDistributor() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_CREATE]);
    }

    show(distributor) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_SHOW, distributor.alias]);
    }

    markDeleted(distributor) {
        this.sweetAlertService.deleteCheck(this, distributor);
    }

    reloadList() {
        this.loadDistributor();
    }

    remove(distributor) {
        this.distributorService.deleteDistributor(distributor.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                 this.sweetAlertService.deleteConfirmation(this.client.distributorNickName);
                 this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
                 this.loadDistributor();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(distributor) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_EDIT, distributor .alias]);
    }

    changeStatus(distributor, status) {
        distributor.active = status;
        this.distributorService.updateDistributor(distributor)
        .subscribe(
        data => {
              if (data['hasError']) {
                  this.assignResponseError(data, this.form);
              } else {
                  this.sweetAlertService.updateConfirmation(this.client.distributorNickName);
                  this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
              }
              this.loading = false;
        },
        failure => {
              this.httpResponseService.showErrorResponse(failure);
              this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
              this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
           if (data.error.errorField === DISTRIBUTOR_CONSTANTS.FIELD.NAME) {
               form.form.controls[DISTRIBUTOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
           }
        }
    }

    searchDistributor(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadDistributor();
        } else {
            this.query = '';
            this.loadDistributor();
        }
    }

    changePassword(distributor) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_CHANGE_PASSWORD, distributor.alias]);
    }

    showDistributorSubscription(distributor) {
        this.tooltipService.clear();
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_SUBSCRIPTION_LIST, distributor.alias]);
    }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
