import { Component, OnInit,Input } from '@angular/core';
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

@Component({
    selector:'vendorPrint',
    moduleId: module.id.toString(),
    templateUrl: 'vendor-print.component.html'
})

export class VendorPrintComponent implements OnInit {
    loading = false;
    invoice: any= {};
    form: any= {};
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
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_VENDOR_LIST_LINK, VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT, true);
        breadCrumService.pushStep(INVOICE_CONSTANTS.LABEL.INVOICE_VENDOR_SHOW_LINK, INVOICE_CONSTANTS.URL.INVOICE_VENDOR_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.INVOICE_CONSTANTS.LABEL.INVOICE);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;


        });
    }

    ngOnInit() {
        this.loadInvoice();
        $( document ).ready(function() {
            setTimeout(function(){
                window.print();
            }, 2000);

        });
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

}
