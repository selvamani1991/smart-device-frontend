import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorProductService } from '../../services/distributor-product.service';
import { DistributorService } from '../../services/distributor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'all-distributor-product.component.html'
})

export class AllDistributorProductComponent implements OnInit {
    distributors: any = [];
    distributor: any= {};
    distributorProducts: any= [];
    services= [];
    client: any= {};
    currentUser: any= {};
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
    query= '';
    totalPages= 0;
    constructor(
                private router: Router,
                private distributorProductService: DistributorProductService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private dateService: DateService,
                private distributorService: DistributorService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
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
        });
    }

    ngOnInit() {
        this.loadDistributorProducts();
        this.loadClient();
    }

    loadDistributorProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.distributorProductService.getAllDistributorProductLists(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributorProducts = data['data'];
            this.paginationItems = this.distributorProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            let reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (var i = 0; i < this.distributorProducts.length; i++) {
                if (this.distributorProducts[i].dispatchedDate && this.distributorProducts[i].dispatchedDate > 0 ) {
                    this.distributorProducts[i].dispatchedDate = this.dateService.getDateString(this.distributorProducts[i].dispatchedDate);
                }else {
                    this.distributorProducts[i].dispatchedDate = 'N/A';
                }

                if (this.distributorProducts[i].acceptedDate && this.distributorProducts[i].acceptedDate > 0 ) {
                    this.distributorProducts[i].acceptedDate = this.dateService.getDateString(this.distributorProducts[i].acceptedDate);
                }else {
                    this.distributorProducts[i].acceptedDate = 'N/A';
                }
            }

        },
        error => {
            $('body').removeClass('loading');
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadDistributorProducts();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadDistributorProducts();
    }

    show(distributor) {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_SHOW, distributor.alias]);
    }

    markDeleted(distributor) {
        this.sweetAlertService.deleteCheck(this, distributor);
    }

    reloadList() {
        this.loadDistributorProducts();
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(distributor) {
         this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_EDIT, distributor.alias]);
    }

    changeStatus(distributor, status) {
        distributor.active = status;
        this.distributorService.updateDistributor(distributor)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
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

   searchDistributorProduct(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query=myModel;
            this.currentPage=1;
            this.loadDistributorProducts();
        } else {
            this.query='';
            this.loadDistributorProducts();
        }
   }

   changePassword(distributor) {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_CHANGE_PASSWORD, distributor.alias]);
   }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('All' + ' ' + this.client.distributorNickName + ' ' + this.client.productNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
