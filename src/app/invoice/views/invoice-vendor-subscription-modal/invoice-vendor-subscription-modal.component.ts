import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {INVOICE_CONSTANTS } from '../../constants';
import { VENDOR_CONSTANTS } from '../../../vendor/constants';
import {INVOICE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { InvoiceService } from '../../services/invoice.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'invoice-vendor-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'invoice-vendor-subscription-modal.component.html'
})

export class InvoiceVendorSubscriptionModalComponent implements OnInit {
    @Input() invoice;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    selectedSubscription= {id: 0};
    selectedVendorSubscription: any = {id: 0};
    vendorSubscriptions= [];
    vendorForm:FormGroup;
    vendorProduct: any= {};
    vendorProducts: any= [];
    vendor: any= {};
    subscription: any= {};
    loading = false;
    click = false;
    startDate: any= {};
    invoices: any= [];
    alias: any= {};
    form: any= {};
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    INVOICE_VALIDATOR= INVOICE_VALIDATOR;
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
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.INVOICE_VALIDATOR = INVOICE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.INVOICE_CONSTANTS.LABEL.INVOICE);
    }

    ngOnInit() {
       this.loadCurrentSubscriptions();
       this.vendorForm = this.createVendorProductForm();
    }

    createVendorProductForm(): FormGroup {
        return this.vendorForm = this._formBuilder.group({
            vendorSubscription             : [0,Validators.required],
        });
    }

    loadCurrentSubscriptions() {
        let _self = this;
        this.loading = true;
        $('body').addClass('loading');
        this.invoiceService.getCurrentSubscriptions()
        .subscribe(
        data => {
        $('body').removeClass('loading');
             this.vendorSubscriptions = data['data'];
            var activeSubscriptions=[];
            for(let i=0; i<this.vendorSubscriptions.length; i++){
                 if(this.vendorSubscriptions[i].active){
                     activeSubscriptions.push(this.vendorSubscriptions[i])
                 }
            }
            this.vendorSubscriptions=activeSubscriptions;
             $('#vendorSubscriptionSelect').select2({
                width: '100%'
             });
             $('#vendorSubscriptionSelect').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectVendorSubscriptions(selectId);
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

    selectVendorSubscriptions(vendorSubscriptionId) {
        for (let i = 0; i < this.vendorSubscriptions.length; i++) {
            if (this.vendorSubscriptions[i].id == vendorSubscriptionId) {
                this.selectedVendorSubscription = this.vendorSubscriptions[i];
                this.vendorForm.get('vendorSubscription').setErrors(null);
            }
        }
    }

    acceptInvoice(invoice,f) {
        invoice.status = 'Accepted';
        $('body').addClass('loading');
        this.invoiceService.updateProduct(this.invoice.invoice.alias, this.selectedVendorSubscription.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
                this.loadCurrentSubscriptions();
                $('#invoiceVendorSubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_NEW_VENDOR_PRODUCT]);
            $('#invoiceVendorSubscriptionModal').modal('hide');
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
       if (data.error.errorCode == ERROR_CODE.code_14) {
           if (data.error.errorField == VENDOR_CONSTANTS.FIELD.NAME) {
               form.form.controls[VENDOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
           }
       }
       if (data.error.errorCode == ERROR_CODE.code_29) {
           this.sweetAlertService.notSuccessful(data.error.errorMessage);
       }
    }

    validateForm(f) {
        var error = true;
        if (this.selectedVendorSubscription.id == 0) {
            f.form.controls['vendorSubscription'].setErrors({'required': true});
            error = false;
        }
        return error;
    }

    acceptVendor(form){
        this.click = !this.click;
        this.acceptInvoice(this.invoice,form);
        $('#invoiceVendorSubscriptionModal').modal('hide');
    }
}
