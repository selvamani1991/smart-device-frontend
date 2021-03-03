import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DateService } from '../../../shared/services/date.service';
import { VendorService } from '../../services/vendor.service';
import { VendorProductService } from '../../services/vendor-product.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    selector: 'distributor-type-modal',
    moduleId: module.id.toString(),
    templateUrl: 'distributor-type-modal.component.html'
})
export class DistributorTypeModalComponent implements OnInit {
    invoices: any= [];
    showDropdown= false;
    distributorProduct: any= {};
    dispatchedDate: any;
    selectedInvoice= 0;
    distributors: any= [];
    click=false;
    distributorProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedDistributor: any = {id: 0};
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
        entity: VENDOR_CONSTANTS.LABEL.DISTRIBUTOR_PRODUCT,
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
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private vendorService: VendorService,
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
        this.distributorProductForm = this.createDistributorProductForm();
        $('#distributorTypeModal').on('hidden.bs.modal', function(){
            self.distributorProductForm = self.createDistributorProductForm();
            self.loadDistributors();
        });

        $('#distributorProductDispatchedDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.dispatchedDate = selectedDate;
                 this.distributorProductForm.get('dispatchedDate').setErrors(null);
             }
        });
        this.loadDistributors();
        this.loadClient();
        $('#vendor-distributor-select').select2({
            width: '100%'
        });

        $('#invoiceSelectDistributor').select2({
            width: '100%'
        });
    }

    createDistributorProductForm(): FormGroup {
        return this.distributorProductForm = this._formBuilder.group({
            distributor        : [0,[Validators.required]],
            dispatchedDate     : ['',[Validators.required]],
            invoiceId          : [0],
            isNewInvoice       : ['newInvoice'],
            price               : ['',[Validators.required,Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],

        });
    }

    createDistributorProduct(form) {
        this.distributorProduct = this.distributorProductForm.value;
        $('body').addClass('loading');
        this.distributorProduct = {
            distributor             : this.selectedDistributor,
            product                 : this.product,
            price                   : this.distributorProduct.price,
            newInvoice: this.distributorProduct.isNewInvoice == 'newInvoice' ? true : false,
            status                  : 'New'
        };

        if (!this.distributorProduct.newInvoice) {
            this.distributorProduct.invoiceId = this.selectedInvoice;
        }

        this.distributorProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.vendorProductService.saveDistributorProduct(this.distributorProduct)
        .subscribe(
        data => {
             $('body').removeClass('loading');
             if (data['hasError']) {
             } else {
                  this.sweetAlertService.createConfirmation(this.client.distributorNickName + ' ' + this.client.productNickName);
                  this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_DISTRIBUTOR_PRODUCT]);
                  form.resetForm();
                  $('#distributorTypeModal').modal('hide');
                  this.submitEvent.emit(1);

             }
             this.loading = false;
        },
        failure => {
             $('body').removeClass('loading');
             this.httpResponseService.showErrorResponse(failure);
             this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_ASSIGNED_DISTRIBUTOR_PRODUCT]);
             form.resetForm();
             $('#distributorTypeModal').modal('hide');
             this.loading = false;
        });
    }

    loadDistributors() {
        var _self = this;
        this.loading = true;
        this.vendorProductService.getAllDistributors()
        .subscribe(
        data => {
            this.distributors = data['data'];
            var activeDistributors=[];
            for(let i=0; i<this.distributors.length; i++){
                if(this.distributors[i].active){
                    activeDistributors.push(this.distributors[i])
                }
            }
            this.distributors=activeDistributors;
            $('#vendor-distributor-select').select2({
                width: '100%'
            });
            $('#vendor-distributor-select').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectDistributor(selectId);
            });
            this.paginationItems = this.distributors;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectDistributor(distributorId) {
        for (let i = 0; i < this.distributors.length; i++) {
            if (this.distributors[i].id == distributorId) {
                this.selectedDistributor = this.distributors[i];
                this.distributorProductForm.get('distributor').setErrors(null);
                this.loadInvoice();
            }
        }
    }

    loadInvoice() {
        var _self = this;
        this.loading = true;
        this.vendorProductService.getInvoice(this.selectedDistributor.alias)
        .subscribe(
        data => {
            this.invoices = data['data'];
            $('#invoiceSelectDistributor').select2({
              width: '100%'
            });
            $('#invoiceSelectDistributor').on('select2:select', function(e){
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
        if (this.selectedDistributor.id == 0) {
            f.form.controls['distributor'].setErrors({'required': true});
            error = false;
        }
        if (!this.dispatchedDate) {
            f.form.controls['dispatchedDate'].setErrors({'required': true});
            error = false;
        }
        if (this.distributorProductForm.get('isNewInvoice').value == 'existingInvoice' && this.selectedInvoice == 0) {
            this.distributorProductForm.get('invoiceId').setErrors({'required': true});
            error = false;
        }
        return error;
    }

    onButtonClick(form){
        this.click = !this.click;
        this.createDistributorProduct(form);
        $('#distributorTypeModal').modal('hide');
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
            text= text.replace('Distributor', this.client.distributorNickName?this.client.distributorNickName:'Distributor');
            return text;
        }

    }

}
