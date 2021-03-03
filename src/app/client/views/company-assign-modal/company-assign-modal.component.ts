import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_VALIDATOR } from '../../validator';
import {COMPANY_CONSTANTS } from '../../../company/constants';
import {PRODUCT_CONSTANTS } from '../../../product/constants';
import {PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientProductService } from '../../services/client-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ClientService } from '../../services/client.service';
declare var $: any;

@Component({
    selector: 'company-assign-modal',
    moduleId: module.id.toString(),
    templateUrl: 'company-assign-modal.component.html'
})
export class CompanyAssignModalComponent implements OnInit {
    clients: any= [];
    invoices: any= [];
    showDropdown= false;
    companyProductObj: any= {};
    companyProduct: any= {};
    company: any= {};
    dispatchedDate: any;
    manufacturerDate: any;
    click=false;
    products: any= [];
    companies: any= [];
    companyProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompany: any = {id: 0};
    selectedInvoice= 0;
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    client:any={};
    currentUser=undefined;
    itemSize= 0;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.COMPANY_PRODUCT,
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
        this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
        this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        var self = this;
        this.companyProductForm = this.createCompanyProductForm();
         $('#companyAssignModal').on('hidden.bs.modal', function(){
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
        $('#company-select').select2({
            width: '100%'
        });

        $('#invoiceSelectCompany').select2({
            width: '100%'
        });
    }

    createCompanyProductForm(): FormGroup {
        return this.companyProductForm = this._formBuilder.group({
            company             : [0,[Validators.required]],
            invoiceId             : [0,[Validators.required]],
            dispatchedDate      : ['',[Validators.required]],
            isNewInvoice        : ['newInvoice'],
            price               : ['', [Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
            manufacturerDate    : [this.product.manufacturerDate]
        });
    }

    createCompanyProduct(form) {
        this.companyProduct = this.companyProductForm.value;
        $('body').addClass('loading');
        this.product.manufacturerDate = this.dateService.getLongFromString(this.product.manufacturerDate);
        this.companyProduct = {
            company : this.selectedCompany,
            product: this.product,
            price: this.companyProduct.price,
            newInvoice: this.companyProduct.isNewInvoice == 'newInvoice' ? true : false,
            status: 'New'
        };
        if (!this.companyProduct.newInvoice) {
            this.companyProduct.invoiceId = this.selectedInvoice;
        }
        console.log(this.product);
        this.companyProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.clientProductService.saveCompanyProduct(this.companyProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.client.companyNickName + ' ' +this.client.productNickName);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
                form.resetForm();
                $('#companyAssignModal').modal('hide');
                this.submitEvent.emit(1);

            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_LIST, this.product.productType.alias]);
            form.resetForm();
            $('#companyAssignModal').modal('hide');
            this.loading = false;
        });
    }

    loadCompanies() {
        var _self = this;
        this.loading = true;
        this.clientProductService.getAllCompanies()
        .subscribe(
        data => {
            this.companies = data['data'];
            var activeCompanies=[];
            for(let i=0; i<this.companies.length; i++){
                  if(this.companies[i].active){
                      activeCompanies.push(this.companies[i])
                  }
            }
            this.companies=activeCompanies;
            $('#company-select').select2({
                width: '100%'
            });
            $('#company-select').on('select2:select', function(e){
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
        this.clientProductService.getInvoice(this.selectedCompany.alias)
        .subscribe(
        data => {
            this.invoices = data['data'];
            $('#invoiceSelectCompany').select2({
               width: '100%'
            });
            $('#invoiceSelectCompany').on('select2:select', function(e){
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
        if (isNewInvoice == 'existingInvoice' && this.invoices.length > 0) {
            this.showDropdown = true;
        }else {
            this.showDropdown = false;
        }
    }

    validateForm() {
        var error = true;
        if (this.selectedCompany.id == 0) {
            this.companyProductForm.get('company').setErrors({'required': true});
            error = false;
        }
        if (!this.dispatchedDate) {
            this.companyProductForm.get('dispatchedDate').setErrors({'required': true});
            error = false;
        }
        if (this.companyProductForm.get('isNewInvoice').value == 'existingInvoice' && this.selectedInvoice == 0) {
            this.companyProductForm.get('invoiceId').setErrors({'required': true});
            error = false;
        }
        return error;
    }

    submitCompany(form){
        this.click=!this.click;
        this.createCompanyProduct(form);
        $('#companyAssignModal').modal('hide');
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
            text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
            return text;
        }

    }
}
