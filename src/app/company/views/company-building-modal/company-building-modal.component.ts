import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { COMPANY_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
import { CompanyProductService } from '../../services/company-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'company-building-modal',
    moduleId: module.id.toString(),
    templateUrl: 'company-building-modal.component.html'
})

export class CompanyBuildingModalComponent implements OnInit {
    companies: any= [];
    companyBuildingProductObj: any= {};
    companyBuildingProduct: any= {};
    companyBuilding: any= {};
    dispatchedDate: any;
    click=false;
    companyBuildings: any= [];
    companyBuildingProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompanyBuilding: any = {id: 0};
    loading = false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    COMPANY_VALIDATOR= COMPANY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    currentUser=undefined;
    client:any={};
    itemSize= 0;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_BUILDING_PRODUCT,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_CREATE;
    buttonName1= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_EDIT;
    backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private companyProductService: CompanyProductService,
                private companyService: CompanyService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
          this.COMPANY_VALIDATOR = COMPANY_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
          this.authenticationService.sessionChange$.subscribe(
              () => {
                  this.currentUser = authenticationService.getCurrentUser();
              }
          );
    }

    ngOnInit() {
        var self = this;
        this.companyBuildingProductForm = this.createCompanyBuildingProductForm();
        $('#companyBuildingModal').on('hidden.bs.modal', function(){
            self.companyBuildingProductForm = self.createCompanyBuildingProductForm();
            self.loadCompanyBuildings();
        });

        $('#companyProductDispatchedDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                this.dispatchedDate = selectedDate;
                this.companyBuildingProductForm.get('dispatchedDate').setErrors(null);
             }
        });
        this.loadClient();
        this.loadCompanyBuildings();
        $('#company-building-select').select2({
            width: '100%'
        });
    }

    createCompanyBuildingProductForm(): FormGroup {
        return this.companyBuildingProductForm = this._formBuilder.group({
            companyBuilding             : [0,[Validators.required]],
            dispatchedDate              : ['',[Validators.required]],
            section                     : ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            floor                       : ['', [Validators.required, Validators.pattern('^[0-9]*$')]]

        });
    }

    createCompanyBuildingProduct(form) {
        this.companyBuildingProductObj = this.companyBuildingProductForm.value;
        $('body').addClass('loading');
        this.companyBuildingProduct = {
            companyBuilding : this.selectedCompanyBuilding,
            product         : this.product,
            section         : this.companyBuildingProductObj.section,
            floor           : this.companyBuildingProductObj.floor,
            status          : 'New'
        };
        this.companyBuildingProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.companyProductService.saveCompanyBuildingProduct(this.companyBuildingProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.client.companyBuildingNickName  + ' ' + this.client.productNickName);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
                form.resetForm();
                $('#companyBuildingModal').modal('hide');
                this.submitEvent.emit(1);

            }
            this.loading = false;
        },

        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
            form.resetForm();
            $('#companyBuildingModal').modal('hide');
            this.loading = false;
        });
    }

    loadCompanyBuildings() {
        var _self = this;
        this.loading = true;
        this.companyProductService.getAllCompanyBuildings()
        .subscribe(
        data => {
            this.companyBuildings = data['data'];
             var activeCompanyBuilding=[];
             for(let i=0; i<this.companyBuildings.length; i++){
                 if(this.companyBuildings[i].active){
                     activeCompanyBuilding.push(this.companyBuildings[i])
                 }
             }
             this.companyBuildings=activeCompanyBuilding;
             $('#company-building-select').select2({
                width: '100%'
             });
             $('#company-building-select').on('select2:select', function(e){
                 var selectId = e.params.data.id;
                 _self.selectCompanyBuilding(selectId);
             });
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectCompanyBuilding(companyBuildingId) {
        for (var i = 0; i < this.companyBuildings.length; i++) {
            if (this.companyBuildings[i].id == companyBuildingId) {
                this.selectedCompanyBuilding = this.companyBuildings[i];
                this.companyBuildingProductForm.get('companyBuilding').setErrors(null);
            }
        }
    }

    validateForm(f) {
        let valid = true;
        if (this.selectedCompanyBuilding.id == 0){
            this.companyBuildingProductForm.get('companyBuilding').setErrors({'required': true});
            valid = false;
        }else {
            this.companyBuildingProductForm.get('companyBuilding').setErrors(null);
        }
        if (!this.dispatchedDate) {
            this.companyBuildingProductForm.get('dispatchedDate').setErrors({'required': true});
        }else {
            this.companyBuildingProductForm.get('dispatchedDate').setErrors(null);
        }
    }

    clickCompanyBuilding(form){
        this.click = !this.click;
        this.createCompanyBuildingProduct(form);
        $('#companyBuildingModal').modal('hide');
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
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
            text= text.replace('Building', this.client.companyBuildingNickName?this.client.companyBuildingNickName:'CompanyBuilding');
            return text;
        }

    }
}
