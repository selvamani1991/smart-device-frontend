import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { INVOICE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { InvoiceService} from '../../services/invoice.service';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { TelemetricService } from '../../../shared/services/telemetric.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'company-show.component.html'
})

export class CompanyShowComponent implements OnInit {
    loading = false;
    invoice: any= {};
    form: any= {};
    client: any= {};
    currentUser=undefined;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
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
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        if(this.telemetricService.getCurrentPage()=='companyProduct'){
            breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_COMPANY_LIST_LINK, COMPANY_CONSTANTS.URL.COMPANY_COMPANY_PRODUCT, true);
        }
        if(this.telemetricService.getCurrentPage()=='NewProduct'){
            breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_COMPANY_LIST_LINK, COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT, true);
        }
        breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_COMPANY_SHOW_LINK, INVOICE_CONSTANTS.URL.INVOICE_COMPANY_SHOW, false);
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

    acceptInvoice() {
        this.invoice.status = 'Accepted';
        this.invoiceService.updateInvoiceProduct(this.invoice, this.alias)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.loadInvoice();
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            this.loading = false;
        });
    }

    rejectInvoice(companyProduct) {
        companyProduct.status = 'Rejected';
        this.invoiceService.rejectCompanyProduct(companyProduct)
        .subscribe(
        data => {
            if (data['hasError']) {
               this.assignResponseError(data, this.form);
               this.loadInvoice();
            } else {
               this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == COMPANY_CONSTANTS.FIELD.NAME) {
                form.form.controls[COMPANY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    showCompanyProduct() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
    }

    invoiceCompanySubscription() {
        $('#invoiceCompanySubscriptionModal').modal('show');
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
