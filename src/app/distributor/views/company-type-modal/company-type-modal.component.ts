import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DISTRIBUTOR_CONSTANTS } from '../../constants';
import { DISTRIBUTOR_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorProductService } from '../../services/distributor-product.service';
import { DistributorService } from '../../services/distributor.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'company-type-modal',
    moduleId: module.id.toString(),
    templateUrl: 'company-type-modal.component.html'
})

export class CompanyTypeModalComponent implements OnInit {
    showDropdown= false;
    distributors: any= [];
    invoices: any= [];
    companyProduct: any= {};
    dispatchedDate: any;
    companies: any= [];
    click=false;
    companyProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompany: any = {id: 0};
    selectedInvoice= 0;
    loading = false;
    client:any={};
    currentUser=undefined;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    DISTRIBUTOR_VALIDATOR= DISTRIBUTOR_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.COMPANY_PRODUCT,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_CREATE;
    buttonName1= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_EDIT;
    backUrl= DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private distributorProductService: DistributorProductService,
                private distributorService: DistributorService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
          this.DISTRIBUTOR_VALIDATOR = DISTRIBUTOR_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
          this.authenticationService.sessionChange$.subscribe(
              () => {
                  this.currentUser = authenticationService.getCurrentUser();
              }
          );
    }

    ngOnInit() {
        let self = this;
        this.companyProductForm = this.createCompanyProductForm();
        $('#companyTypeModal').on('hidden.bs.modal', function(){
            self.companyProductForm = self.createCompanyProductForm();
            self.loadCompanies();
        });


        $('#companyAssignedDate').datepicker({
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
        $('#distributor-company-select').select2({
            width: '100%'
        });
    }

    createCompanyProductForm(): FormGroup {
        return this.companyProductForm = this._formBuilder.group({
            company             : [0,[Validators.required]],
            dispatchedDate      : ['',[Validators.required]],
            invoiceId           : [0],
            isNewInvoice        : ['newInvoice'],
            price               : ['',[Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
        });
    }

    createCompanyProduct(form) {
        this.companyProduct = this.companyProductForm.value;
        $('body').addClass('loading');
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
        this.companyProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.distributorProductService.saveCompanyProduct(this.companyProduct)
        .subscribe(
        data => {
             $('body').removeClass('loading');
             if (data['hasError']) {
             } else {
                  this.sweetAlertService.createConfirmation(this.client.companyNickName + ' ' + this.client.productNickName);
                 this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_ASSIGNED_COMPANY_PRODUCT]);
                 form.resetForm();
                 $('#companyTypeModal').modal('hide');
                 this.submitEvent.emit(1);


             }
             this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_DISTRIBUTOR_PRODUCT]);
            form.resetForm();
            $('#companyTypeModal').modal('hide');
            this.loading = false;
        });
    }

    loadCompanies() {
        let _self = this;
        this.loading = true;
        this.distributorProductService.getAllCompanies()
        .subscribe(
        data => {
            this.companies = data['data'];
            var activeCompany=[];
            for(let i=0; i<this.companies.length; i++){
                if(this.companies[i].active){
                    activeCompany.push(this.companies[i])
                }
            }
            this.companies=activeCompany;
            $('#distributor-company-select').select2({
            width: '100%'
        });
        $('#distributor-company-select').on('select2:select', function(e){
            let selectId = e.params.data.id;
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
        let _self = this;
        this.loading = true;
        this.distributorProductService.getInvoice(this.selectedCompany.alias)
        .subscribe(
        data => {
            this.invoices = data['data'];
            $('#SelectCompanyByDistributor').select2({
               width: '100%'
            });
            $('#SelectCompanyByDistributor').on('select2:select', function(e){
              let selectId = e.params.data.id;
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
        let error = true;
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
       this.distributorService.getClient(this.currentUser.ownerId)
       .subscribe(
       data => {
           this.client = data['data'][0];
       },
       () => {
           this.loading = false;
       });
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    replaceText(text){
        if(this.currentUser.userType!='SuperAdmin'){
            text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
            return text;
        }

    }
}
