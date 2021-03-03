import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorService } from '../../services/vendor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'vendor-subscription-list.component.html'
})

export class VendorSubscriptionListComponent implements OnInit {
    vendorSubscriptions: any= [];
    vendorSubscription: any= {};
    alias: any= {};
    client: any= {};
    currentUser=undefined;
    vendor: any= {};
    form: any= {};
    services= [];
    loading = false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION_LIST,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION_LIST_DESC
    };
    steps= [];
    startDates= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private vendorService: VendorService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR_SUBSCRIPTION);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadVendor();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadVendorSubscriptions();
        this.loadClient();
    }

    loadVendorSubscriptions() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorService.getVendorSubscription(this.currentPage, this.pageSize, this.alias,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.vendorSubscriptions = data['data'];
            this.paginationItems = this.vendorSubscriptions;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (let i = 0; i < this.vendorSubscriptions.length; i++) {
                this.vendorSubscriptions[i].startDate = this.dateService.getDateString(this.vendorSubscriptions[i].startDate);
                this.vendorSubscriptions[i].endDate = this.dateService.getDateString(this.vendorSubscriptions[i].endDate);
            }
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadVendor() {
        this.vendorService.getVendor(this.alias)
        .subscribe(
        data => {
            this.vendor = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    changePage(event) {
        this.currentPage = event;
        this.loadVendorSubscriptions();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadVendorSubscriptions();
    }

    searchVendorSubscription(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadVendorSubscriptions();
        }else {
            this.query = '';
            this.loadVendorSubscriptions();
        }
    }

    addVendorSubscription() {
        $('#vendorSubscriptionModal').modal('show');
    }

    reloadVendorSubscription() {
        this.loadVendorSubscriptions();
    }

    edit(vendorSubscription) {
        this.tooltipService.clear();
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_EDIT, vendorSubscription.alias]);
    }

    changeStatus(vendorSubscription, status) {
        vendorSubscription.active = status;
        vendorSubscription.startDate = this.dateService.getLongFromString(vendorSubscription.startDate);
        vendorSubscription.endDate = this.dateService.getLongFromString(vendorSubscription.endDate);
        this.vendorService.updateVendorSubscription(vendorSubscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                vendorSubscription.startDate = this.dateService.getDateString(vendorSubscription.startDate);
                vendorSubscription.endDate = this.dateService.getDateString(vendorSubscription.endDate);
                this.sweetAlertService.updateConfirmation(this.client.vendorNickName + ' ' + 'Subscription');
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendor.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, this.vendor.alias]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == VENDOR_CONSTANTS.FIELD.NAME) {
                form.form.controls[VENDOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'List', VENDOR_CONSTANTS.URL.VENDOR_LIST, true);
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' + 'Subscription List', VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

}
