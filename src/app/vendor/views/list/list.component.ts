import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorService } from '../../services/vendor.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    vendors: any = [];
    vendor: any= {};
    client: any= {};
    services= [];
    form: any= {};
    alias: any= {};
    loading = false;
    currentUser=undefined;
    active= false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
    entity: VENDOR_CONSTANTS.LABEL.VENDOR,
    pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_LIST,
    pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private router: Router,
                private vendorService: VendorService,
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(VENDOR_CONSTANTS.LABEL.VENDOR_LIST_LINK, VENDOR_CONSTANTS.URL.VENDOR_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadVendor();
        this.loadClient();
    }

    loadVendor() {
        this.loading = true;
        $('body').addClass('loading');
        this.vendorService.getAllVendors(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.vendors = data['data'];
                this.paginationItems = this.vendors;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                var reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
                 this.tooltipService.enable();

            },
            error => {
                $('body').removeClass('loading');
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadVendor();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadVendor();
    }

    addVendor() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_CREATE]);
    }

    show(vendor) {
        this.tooltipService.clear();
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_SHOW, vendor.alias]);
    }

    markDeleted(vendor) {
        this.tooltipService.clear();
        this.sweetAlertService.deleteCheck(this, vendor);
    }

    reloadList() {
        this.loadVendor();
    }

    showVendorSubscription(vendor) {
        this.tooltipService.clear();
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_VENDOR_SUBSCRIPTION_LIST, vendor.alias]);
    }

    remove(vendor) {
        this.vendorService.deleteVendor(vendor.alias)
        .subscribe(
            data => {
                if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                     this.sweetAlertService.deleteConfirmation(this.client.vendorNickName);
                     this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
                        this.loadVendor();
                }else {
                    this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                }
            },
            error => {
                this.alertService.error(error.message);
                this.loading = false;
            }
        );
    }

    productShow() {
        $('#productTypeModal').modal();
    }

    edit(vendor) {
        this.tooltipService.clear();
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_EDIT, vendor.alias]);
    }

    changeStatus(vendor, status) {
         vendor.active = status;
         this.vendorService.updateVendor(vendor)
         .subscribe(
         data => {
             if (data['hasError']) {
                 this.assignResponseError(data, this.form);
             } else {
                 this.sweetAlertService.updateConfirmation(this.client.vendorNickName);
                 this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
             }
             this.loading = false;
         },
         failure => {
             this.httpResponseService.showErrorResponse(failure);
             this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
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

    searchVendor(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadVendor();
        }else {
            this.query = '';
            this.loadVendor();
        }
    }

    changePassword(vendor) {
        this.tooltipService.clear();
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_CHANGE_PASSWORD, vendor.alias]);
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName+ ' ' + 'List', VENDOR_CONSTANTS.URL.VENDOR_LIST, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    replaceText(text){
        text= text.replace('Vendor', this.client.vendorNickName?this.client.vendorNickName:'Vendor');
        return text;

    }
 }