import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_WIZARD_CONSTANTS } from '../../constants';
import { INVOICE_CONSTANTS } from '../../../invoice/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ProductWizardService} from '../../services/product-wizard.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'invoice-show.component.html'
})

export class InvoiceShowComponent implements OnInit {
    loading = false;
    invoice: any= {};
    form: any= {};
    PRODUCT_WIZARD_CONSTANTS= PRODUCT_WIZARD_CONSTANTS;
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: PRODUCT_WIZARD_CONSTANTS.LABEL.INVOICE_IMAGE,
        pageTitle: PRODUCT_WIZARD_CONSTANTS.LABEL.INVOICE_SHOW,
        pageDesc: PRODUCT_WIZARD_CONSTANTS.LABEL.INVOICE_SHOW_DESC
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
                private productWizardService: ProductWizardService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.PRODUCT_WIZARD_CONSTANTS = PRODUCT_WIZARD_CONSTANTS;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ORDER_LIST_LINK, PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, true);
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ORDER_LIST_LINK, PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_INVOICE_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;
            this.loadInvoice();
        });
    }

    ngOnInit() {

    }

    loadInvoice() {
        this.loading = true;
        $('body').addClass('loading');
        this.productWizardService.getInvoiceData(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.invoice = data['data'][0];
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST]);
            this.loading = false;
        });
    }

    printVendor(){
         window.open(window.location.origin+INVOICE_CONSTANTS.URL.INVOICE_VENDOR_PRINT.replace(":alias",this.alias), '_blank');
    }
}
