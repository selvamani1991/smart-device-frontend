import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {INVOICE_CONSTANTS } from '../../constants';
import {INVOICE_VALIDATOR } from '../../validator';
import { DISTRIBUTOR_CONSTANTS } from '../../../distributor/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { InvoiceService } from '../../services/invoice.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'invoice-distributor-subscription-modal',
    moduleId: module.id.toString(),
    templateUrl: 'invoice-distributor-subscription-modal.component.html'
})

export class InvoiceDistributorSubscriptionModalComponent implements OnInit {
    @Input() invoice;
    @Input() client;
    @Output() submitEvent = new EventEmitter<number>();
    selectedSubscription= {id: 0};
    selectedDistributorSubscription: any = {id: 0};
    distributorSubscriptions= [];
    distributorForm:FormGroup;
    loading = false;
    click = false;
    startDate: any= {};
    alias: any= {};
    form: any= {};
    INVOICE_CONSTANTS= INVOICE_CONSTANTS;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
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
                private route: ActivatedRoute,
                private sweetAlertService: SweetAlertService,
                private invoiceService: InvoiceService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.INVOICE_CONSTANTS = INVOICE_CONSTANTS;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.INVOICE_VALIDATOR = INVOICE_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.INVOICE_CONSTANTS.LABEL.INVOICE);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
        });
    }

    ngOnInit() {
        this.loadCurrentSubscriptions();
        this.distributorForm = this.createDistributorProductForm();
    }

    createDistributorProductForm(): FormGroup {
        return this.distributorForm = this._formBuilder.group({
            distributorSubscription             : [0,Validators.required],
        });
    }

    loadCurrentSubscriptions() {
        let _self = this;
        this.loading = true;
        this.invoiceService.getCurrentSubscriptions()
        .subscribe(
        data => {
            this.distributorSubscriptions = data['data'];
            var activeSubscriptions=[];
            for(let i=0; i<this.distributorSubscriptions.length; i++){
                 if(this.distributorSubscriptions[i].active){
                     activeSubscriptions.push(this.distributorSubscriptions[i])
                 }
            }
            this.distributorSubscriptions=activeSubscriptions;
            $('#distributorSubscriptionSelect').select2({
                width: '100%'
            });
            $('#distributorSubscriptionSelect').on('select2:select', function(e){
            let selectId = e.params.data.id;
            _self.selectDistributorSubscription(selectId);
            });
            this.loading = false;

        },
        error => {
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.router.navigate([INVOICE_CONSTANTS.URL.INVOICE_VENDOR_SHOW]);
            this.loading = false;
        });
    }

    selectDistributorSubscription(distributorSubscriptionId) {
        for (let i = 0; i < this.distributorSubscriptions.length; i++) {
            if (this.distributorSubscriptions[i].id == distributorSubscriptionId) {
                this.selectedDistributorSubscription = this.distributorSubscriptions[i];
                this.distributorForm.get('distributorSubscription').setErrors(null);
            }
        }
    }

    acceptInvoice(invoice,f) {
        invoice.status = 'Accepted';
        $('body').addClass('loading');
        this.invoiceService.updateProduct(this.invoice.invoice.alias, this.selectedDistributorSubscription.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT]);
                this.loadCurrentSubscriptions();
                $('#invoiceDistributorSubscriptionModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_NEW_DISTRIBUTOR_PRODUCT]);
            $('#invoiceDistributorSubscriptionModal').modal('hide');
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
       if (data.error.errorCode == ERROR_CODE.code_14) {
           if (data.error.errorField == DISTRIBUTOR_CONSTANTS.FIELD.NAME) {
               form.form.controls[DISTRIBUTOR_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
           }
       }
       if (data.error.errorCode == ERROR_CODE.code_29) {
           this.sweetAlertService.notSuccessful(data.error.errorMessage);
       }
    }

    validateForm(f) {
        var error = true;
        if (this.selectedDistributorSubscription.id == 0) {
            f.form.controls['distributorSubscription'].setErrors({'required': true});
            error = false;
        }
        return error;
    }

    acceptDistributor(form){
        this.click = !this.click;
        this.acceptInvoice(this.invoice,form);
        $('#invoiceDistributorSubscriptionModal').modal('hide');
    }
}
