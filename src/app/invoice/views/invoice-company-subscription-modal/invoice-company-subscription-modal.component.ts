import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {INVOICE_CONSTANTS } from '../../constants';
import {INVOICE_VALIDATOR } from '../../validator';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { InvoiceService } from '../../services/invoice.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'invoice-company-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'invoice-company-subscription-modal.component.html'
})
export class InvoiceCompanySubscriptionModalComponent implements OnInit {
    @Input() invoice;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    selectedSubscription= {id: 0};
    selectedCompanySubscription: any = {id: 0};
    companySubscriptions= [];
    companyForm:FormGroup;
    loading = false;
    click = false;
    startDate: any= {};
    alias: any= {};
    form: any= {};
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    INVOICE_VALIDATOR= INVOICE_VALIDATOR;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: INVOICE_CONSTANTS.LABEL.INVOICE,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    active= '';
    buttonName= INVOICE_CONSTANTS.LABEL.INVOICE_ACTION_CREATE;
    buttonName1= INVOICE_CONSTANTS.LABEL.INVOICE_ACTION_EDIT;
    backUrl= INVOICE_CONSTANTS.URL.INVOICE;
    constructor(
                private router: Router,
                private sweetAlertService: SweetAlertService,
                private invoiceService: InvoiceService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.INVOICE_VALIDATOR = INVOICE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.INVOICE_CONSTANTS.LABEL.INVOICE);
    }

    ngOnInit() {
        this.loadCurrentSubscriptions();
        this.companyForm = this.createCompanyProductForm();
    }

    loadCurrentSubscriptions() {
        let _self = this;
        this.loading = true;
        $('body').addClass('loading');
        this.invoiceService.getCurrentSubscriptions()
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companySubscriptions = data['data'];
            var activeSubscriptions=[];
            for(let i=0; i<this.companySubscriptions.length; i++){
                if(this.companySubscriptions[i].active){
                    activeSubscriptions.push(this.companySubscriptions[i])
                }
            }
            this.companySubscriptions=activeSubscriptions;
            $('#companySubscriptionSelect').select2({
            width: '100%'
            });
            $('#companySubscriptionSelect').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectCompanySubscriptions(selectId);
            });
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.router.navigate([INVOICE_CONSTANTS.URL.INVOICE_VENDOR_SHOW]);
            this.loading = false;
        });
    }

    createCompanyProductForm(): FormGroup {
        return this.companyForm = this._formBuilder.group({
            companySubscription             : [0,Validators.required],
        });
    }

    selectCompanySubscriptions(companySubscriptionId) {
        for (let i = 0; i < this.companySubscriptions.length; i++) {
            if (this.companySubscriptions[i].id == companySubscriptionId) {
                this.selectedCompanySubscription = this.companySubscriptions[i];
                this.companyForm.get('companySubscription').setErrors(null);
            }
        }
    }

    acceptInvoice(invoice,f) {
        invoice.status = 'Accepted';
        $('body').addClass('loading');
        this.invoiceService.updateProduct(this.invoice.invoice.alias, this.selectedCompanySubscription.alias)
        .subscribe(
        data => {
        $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
                this.loadCurrentSubscriptions();
                $('#invoiceCompanySubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_NEW_COMPANY_PRODUCT]);
            $('#invoiceCompanySubscriptionModal').modal('hide');
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == COMPANY_CONSTANTS.FIELD.NAME) {
                form.form.controls[COMPANY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
        if (data.error.errorCode == ERROR_CODE.code_29) {
            this.sweetAlertService.notSuccessful(data.error.errorMessage);
        }
    }

    validateForm(f) {
        var error = true;
        if (this.selectedCompanySubscription.id == 0) {
            f.form.controls['companySubscription'].setErrors({'required': true});
                error = false;
        }
        return error;
    }

    acceptCompany(form){
        this.click = !this.click;
        this.acceptInvoice(this.invoice,form);
        $('#invoiceCompanySubscriptionModal').modal('hide');
    }
}
