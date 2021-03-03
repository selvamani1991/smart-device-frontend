import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import {CLIENT_CONSTANTS } from '../../constants';
import {CLIENT_VALIDATOR } from '../../validator';
import {VENDOR_CONSTANTS } from '../../../vendor/constants';
import {PRODUCT_CONSTANTS } from '../../../product/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { ClientProductService } from '../../services/client-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'vendor-assign-modal',
    moduleId: module.id.toString(),
    templateUrl: 'vendor-assign-modal.component.html'
})
export class VendorAssignModalComponent implements OnInit {
    showDropdown= false;
    invoices: any= [];
    vendorProduct: any= {};
    dispatchedDate: any;
    manufacturerDate: any;
    vendors: any= [];
    click=false;
    vendorProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedVendor: any = {id: 0};
    selectedInvoice= 0;
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    client:any={};
    currentUser=undefined;
    itemSize= 0;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.VENDOR_PRODUCT,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_CREATE;
    buttonName1= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_EDIT;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private clientProductService: ClientProductService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private clientService: ClientService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        var self = this;
        this.vendorProductForm = this.createVendorProductForm();
        $('#vendorAssignModal').on('hidden.bs.modal', function(){
            self.vendorProductForm = self.createVendorProductForm();
            self.loadVendors();
        });

        $('#vendorProductDispatchedDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.dispatchedDate = selectedDate;
                this.vendorProductForm.get('dispatchedDate').setErrors(null);
            }
        });
        this.loadClient();
        this.loadVendors();
        $('#vendor-select').select2({
            width: '100%'
        });
        $('#invoiceSelectVendor').select2({
           width: '100%'
        });
    }

    createVendorProductForm(): FormGroup {
        return this.vendorProductForm = this._formBuilder.group({
             vendor            : [0, [Validators.required]],
             invoiceId         : [0, [Validators.required]],
             dispatchedDate    : ['',[Validators.required]],
             isNewInvoice      : ['newInvoice'],
             price             : ['', [Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
             manufacturerDate  : [this.product.manufacturerDate]
        });
    }

    createVendorProduct(form) {
        this.vendorProduct = this.vendorProductForm.value;
        $('body').addClass('loading');
        this.product.manufacturerDate = this.dateService.getLongFromString(this.product.manufacturerDate);
        this.vendorProduct = {
            vendor : this.selectedVendor,
            price: this.vendorProduct.price,
            newInvoice: this.vendorProduct.isNewInvoice == 'newInvoice' ? true : false,
            product: this.product,
            status: 'New'
        };
        if (!this.vendorProduct.newInvoice) {
            this.vendorProduct.invoiceId = this.selectedInvoice;
        }
        this.vendorProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);

        this.clientProductService.saveVendorProduct(this.vendorProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.client.vendorNickName + ' ' +this.client.productNickName);
                 this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
                form.resetForm();
                $('#vendorAssignModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
             this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
            form.resetForm();
            $('#vendorAssignModal').modal('hide');
            this.loading = false;

        });
    }

    loadVendors() {
        var _self = this;
        this.loading = true;
        this.clientProductService.getAllVendors()
        .subscribe(
        data => {
            this.vendors = data['data'];
            var activeVendors=[];
            for(let i=0; i<this.vendors.length; i++){
                if(this.vendors[i].active){
                    activeVendors.push(this.vendors[i])
                }
            }
            this.vendors=activeVendors;
            $('#vendor-select').select2({
                width: '100%'
            });
            $('#vendor-select').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectVendor(selectId);
            });
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectVendor(vendorId) {
        for (let i = 0; i < this.vendors.length; i++) {
            if (this.vendors[i].id == vendorId) {
                this.selectedVendor = this.vendors[i];
                this.vendorProductForm.get('vendor').setErrors(null);
                this.loadInvoice();
            }
        }
    }

    loadInvoice() {
        var _self = this;
        this.loading = true;
        this.clientProductService.getInvoice(this.selectedVendor.alias)
        .subscribe(
        data => {
            this.invoices = data['data'];
            $('#invoiceSelectVendor').select2({
               width: '100%'
            });
            $('#invoiceSelectVendor').on('select2:select', function(e){
              var selectId = e.params.data.id;
              _self.selectInvoice(selectId);
            });
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectInvoice(invoiceId) {
        for (let i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].id == invoiceId) {
                this.selectedInvoice = this.invoices[i].alias;
            }
        }
    }

    selectExistingInvoice(isNewInvoice) {
        if (isNewInvoice == 'existingInvoice' && this.invoices.length > 0 ) {
            this.showDropdown = true;
        }else {
            this.showDropdown = false;
        }
    }

    validateForm(f) {
        var error = true;
        if (this.selectedVendor.id == 0) {
            f.form.controls['vendor'].setErrors({'required': true});
            error = false;
        }
        if (!this.dispatchedDate) {
            f.form.controls['dispatchedDate'].setErrors({'required': true});
            error = false;
        }
        if (this.vendorProductForm.get('isNewInvoice').value == 'existingInvoice' && this.selectedInvoice == 0) {
            this.vendorProductForm.get('invoiceId').setErrors({'required': true});
            error = false;
        }
        return error;
    }

    submitVendor(form){
        this.click=!this.click;
        this.createVendorProduct(form);
        $('#vendorAssignModal').modal('hide');
    }

    loadClient() {
       this.clientService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
           this.client = data['data'][0];
       },
       () => {
           this.loading = false;
       });
    }

    replaceText(text){
        if(this.currentUser.userType!='SuperAdmin'){
             text= text.replace('Vendor', this.client.vendorNickName?this.client.vendorNickName:'Vendor');
             return text;
        }

    }
}
