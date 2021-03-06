import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { INVOICE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { InvoiceService} from '../../services/invoice.service';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'vendor-show.component.html'
})

export class VendorShowComponent implements OnInit {
    loading = false;
    invoice: any= {};
    form: any= {};
    client: any= {};
    currentUser=undefined;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: INVOICE_CONSTANTS.LABEL.INVOICE_IMAGE,
        pageTitle: INVOICE_CONSTANTS.LABEL.INVOICE_COMPANY_SHOW,
        pageDesc: INVOICE_CONSTANTS.LABEL.INVOICE_COMPANY_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private invoiceService: InvoiceService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private telemetricService: TelemetricService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        if(this.telemetricService.getCurrentPage()=='vendorProduct'){
            breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_VENDOR_LIST_LINK, VENDOR_CONSTANTS.URL.VENDOR_VENDOR_PRODUCT, true);
        }
        if(this.telemetricService.getCurrentPage()=='NewProduct'){
            breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_VENDOR_LIST_LINK, VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT, true);
        }
        breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_VENDOR_SHOW_LINK, INVOICE_CONSTANTS.URL.INVOICE_VENDOR_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.INVOICE_CONSTANTS.LABEL.INVOICE);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;
            this.loadInvoice();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadClient();
    }

    loadInvoice() {
        this.loading = true;
         $('body').addClass('loading');
        this.invoiceService.getInvoiceData(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.invoice = data['data'][0];
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    showVendorProduct() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
    }

    acceptInvoice() {
        $('body').addClass('loading');
        this.invoice.status = 'Accepted';
        this.invoiceService.updateProduct(this.invoice, this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
               this.assignResponseError(data, this.form);
            } else {
               this.sweetAlertService.updateConfirmation(this.setting.entity);
               this.loadInvoice();
               this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
            this.loading = false;
        });
    }

    invoiceVendorSubscription() {
        $('#invoiceVendorSubscriptionModal').modal('show');
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === VENDOR_CONSTANTS.FIELD.NAME) {
                form.form.controls[VENDOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    reloadInvoice() {
        this.loadInvoice();
    }

    printVendor(){
         window.open(window.location.origin+INVOICE_CONSTANTS.URL.INVOICE_VENDOR_PRINT.replace(":alias",this.alias), '_blank');
    }

    loadClient() {
        this.invoiceService.getAllClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
        },
        () => {
           this.loading = false;
        });
    }

}
