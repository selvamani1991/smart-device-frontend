import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { VendorService } from '../../services/vendor.service';
declare var $: any;

@Component({
    selector: 'company-vendor-modal',
    moduleId: module.id.toString(),
    templateUrl: 'company-type-modal.component.html'
})
export class CompanyTypeModalComponent implements OnInit {
    showDropdown= false;
    vendors: any= [];
    invoices: any= [];
    companyProduct: any= {};
    dispatchDate: any;
    dispatchedDate: any;
    companies: any= [];
    click=false;
    companyProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompany: any = {};
    selectedInvoice= 0;
    loading = false;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    VENDOR_VALIDATOR= VENDOR_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    client:any={};
    currentUser=undefined;
    itemSize= 0;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_CREATE;
    buttonName1= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_EDIT;
    backUrl= VENDOR_CONSTANTS.URL.VENDOR_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private vendorProductService: VendorProductService,
                private vendorService: VendorService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
          this.VENDOR_VALIDATOR = VENDOR_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
          this.authenticationService.sessionChange$.subscribe(
                () => {
                    this.currentUser = authenticationService.getCurrentUser();
                }
          );

    }

    ngOnInit() {
        var self = this;
        this.companyProductForm = this.createCompanyProductForm();
        $('#companyTypeModal').on('hidden.bs.modal', function(){
            self.companyProductForm = self.createCompanyProductForm();
            self.loadCompanies();
        });
        $('#companyProductDispatchedDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.dispatchedDate = selectedDate;
                this.companyProductForm.get('dispatchedDate').setErrors(null);
        }
        });
        this.loadCompanies();
        this.loadClient();
        $('#vendor-company-select').select2({
            width: '100%'
        });

    }

    createCompanyProductForm(): FormGroup {
        return this.companyProductForm = this._formBuilder.group({
            company          : [0,[Validators.required]],
            dispatchedDate   : ['',[Validators.required]],
            invoiceId          : [0],
            isNewInvoice       : ['newInvoice'],
            price               : ['',[Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],

        });
    }

    createCompanyProduct(form) {
        this.companyProduct = this.companyProductForm.value;
        $('body').addClass('loading');
        this.companyProduct = {
            company     : this.selectedCompany,
            product     : this.product,
            price       : this.companyProduct.price,
            newInvoice  : this.companyProduct.isNewInvoice == 'newInvoice' ? true : false,
            status      : 'New'
        };

        if (!this.companyProduct.newInvoice) {
            this.companyProduct.invoiceId = this.selectedInvoice;
        }
        this.companyProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.vendorProductService.saveCompanyProduct(this.companyProduct)
         .subscribe(
         data => {
             $('body').removeClass('loading');
             if (data['hasError']) {
             } else {
                  this.sweetAlertService.createConfirmation(this.client.companyNickName + ' ' + this.client.productNickName);
                 this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT]);
                 form.resetForm();
                 $('#companyTypeModal').modal('hide');
                 this.submitEvent.emit(1);
             }
             this.loading = false;
         },
         failure => {
              $('body').removeClass('loading');
              this.httpResponseService.showErrorResponse(failure);
              this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_COMPANY_PRODUCT]);
              form.resetForm();
              $('#companyTypeModal').modal('hide');
              this.loading = false;
         });
    }

    loadCompanies() {
        var _self = this;
        this.loading = true;
        this.vendorProductService.getCompanies()
        .subscribe(
        data => {
            this.companies = data['data'];
            $('#vendor-company-select').select2({
                width: '100%'
            });
            $('#vendor-company-select').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectCompany(selectId);
            });

        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;

        });
    }

    selectCompany(companyId) {
        for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].id == companyId) {
                this.selectedCompany = this.companies[i];
                this.companyProductForm.get('company').setErrors(null);
                this.loadInvoice();
            }
        }
    }

    loadInvoice() {
        var _self = this;
        this.loading = true;
        this.vendorProductService.getInvoice(this.selectedCompany.alias)
        .subscribe(
        data => {
            this.invoices = data['data'];
            $('#invoiceSelectCompanies').select2({
              width: '100%'
            });
            $('#invoiceSelectCompanies').on('select2:select', function(e){
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
        if (this.selectedCompany.id == 0) {
            f.form.controls['company'].setErrors({'required': true});
            error = false;
        }
        if (!this.dispatchedDate) {
            f.form.controls['dispatchedDate'].setErrors({'required': true});
            error = false;
        }
        if (this.companyProductForm.get('isNewInvoice').value == 'existingInvoice' && this.selectedInvoice == 0) {
            this.companyProductForm.get('invoiceId').setErrors({'required': true});
            error = false;
        }
        return error;
    }

    clickCompany(form){
        this.click = !this.click;
        this.createCompanyProduct(form);
        $('#companyTypeModal').modal('hide');
    }

    loadClient() {
       this.vendorService.getClient(this.currentUser.ownerId)
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
            text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
            return text;
        }

    }
}
