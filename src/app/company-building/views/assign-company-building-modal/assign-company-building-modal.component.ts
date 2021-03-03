import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COMPANY_BUILDING_CONSTANTS } from '../../../company-building/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import {COMPANY_BUILDING_VALIDATOR } from '../../validator';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyBuildingProductService } from '../../services/company-building-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'assign-company-building-modal',
    moduleId: module.id.toString(),
    templateUrl: 'assign-company-building-modal.component.html'
})

export class AssignCompanyBuildingModalComponent implements OnInit {
    boards: any= [];
    companyBuildingProductObj: any= {};
    companyBuildingProduct: any= {};
    companyBuilding: any= {};
    dispatchedDate: any;
    companyBuildings: any= [];
    companyBuildingProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompanyBuilding: any = {id: 0};
    loading = false;
    click = false;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    COMPANY_BUILDING_VALIDATOR= COMPANY_BUILDING_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_ACTION_CREATE;
    buttonName1= COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_ACTION_EDIT;
    backUrl= COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private companyBuildingProductService: CompanyBuildingProductService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING);
    }

    ngOnInit() {
        this.companyBuildingProductForm = this.createCompanyBuildingProductForm();
        $('#companyBuildingProductDispatchedDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                 this.dispatchedDate = selectedDate;
            }
        });
        this.loadCompanyBuildings();
        $('#building-select').select2({
            width: '100%'
        });
    }

    createCompanyBuildingProductForm(): FormGroup {
        return this.companyBuildingProductForm = this._formBuilder.group({
            companyBuilding              : [0],
            dispatchedDate               : [this.companyBuildingProduct.dispatchedDate],
        });
    }

    createCompanyBuildingProduct(form) {
        this.companyBuildingProductObj = this.companyBuildingProductForm.value;
        $('body').addClass('loading');
        this.companyBuildingProduct = {
            companyBuilding : this.selectedCompanyBuilding,
            product: this.product,
            status: 'New'
        };
        this.companyBuildingProduct.dispatchedDate = this.dateService.getLongFromString(this.dispatchedDate);
        this.companyBuildingProductService.saveCompanyBuildingProduct(this.companyBuildingProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                $('#assignCompanyBuildingModal').modal('hide');
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT]);
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            $('#assignCompanyBuildingModal').modal('hide');
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT]);
            this.loading = false;
        });

    }

    loadCompanyBuildings() {
        let _self = this;
        this.loading = true;
        this.companyBuildingProductService.getCompanyBuildings(this.currentPage, this.pageSize)
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
            $('#building-select').select2({
                width: '100%'
            });
            $('#building-select').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectCompanyBuilding(selectId);
            });
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectCompanyBuilding(companyBuildingId) {
        for (let i = 0; i < this.companyBuildings.length; i++) {
            if (this.companyBuildings[i].id == companyBuildingId) {
                this.selectedCompanyBuilding = this.companyBuildings[i];
            }
        }
    }

    validateForm(f) {
        let error = true;
        if (this.selectedCompanyBuilding.id === 0) {
            f.form.controls['companyBuilding'].setErrors({'required': true});
            error = false;
        }
        if (!this.dispatchedDate) {
            f.form.controls['dispatchedDate'].setErrors({'required': true});
            error = false;
        }
        return error;
    }

    submitMachine(form){
        this.click=!this.click;
        this.createCompanyBuildingProduct(form);
        $('#assignCompanyBuildingModal').modal('hide');
    }
}
