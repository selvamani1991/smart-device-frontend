import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import {BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { BoardProductService } from '../../services/board-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    selector: 'manufacturer-product-type-modal',
    moduleId: module.id.toString(),
    templateUrl: 'manufacturer-product-type-modal.component.html'
})

export class ManufacturerProductTypeModalComponent implements OnInit {
    boardManufacturers: any= [];
    manufacturerProductObj: any= {};
    manufacturerProduct: any= {};
    dispatchDate: any;
    manufacturers: any= [];
    manufacturerProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedManufacturer: any = {};
    loading = false;
    click = false;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_ACTION_CREATE;
    buttonName1= BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_ACTION_EDIT;
    backUrl= BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private _formBuilder: FormBuilder,
                private boardProductService: BoardProductService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
    }

    ngOnInit() {
        this.manufacturerProductForm = this.createManufacturerProductForm();
        this.loadManufacturers();
         $('#dispatchDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.dispatchDate = selectedDate;
             }
         });
    }

    createManufacturerProductForm(): FormGroup {
        return this.manufacturerProductForm = this._formBuilder.group({
            id                  : [''],
            manufacturer        : [0],
            dispatchDate        : [''],
        });
    }

    createManufacturerProduct(form) {
        this.manufacturerProductObj = this.manufacturerProductForm.value;
        $('body').addClass('loading');
        this.boardManufacturers.dispatchDate = this.dateService.getLongFromString(this.dispatchDate);
        this.manufacturerProduct = {
            manufacturer : this.selectedManufacturer,
            product: this.product,
            status: 'New'
        };
        this.boardProductService.saveManufacturerProduct(this.manufacturerProduct)
         .subscribe(
             data => {
                 $('body').removeClass('loading');
                 if (data['hasError']) {
                 } else {
                     this.sweetAlertService.createConfirmation(this.setting.entity);
                     this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_NEW_PRODUCT_LIST]);
                     $('#manufacturerProductTypeModal').modal('hide');
                 }
                 this.loading = false;
             },
             failure => {
                  $('body').removeClass('loading');
                  this.httpResponseService.showErrorResponse(failure);
                  this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
                  this.loading = false;
             }
         );
    }

    loadManufacturers() {
        this.loading = true;
        this.boardProductService.getManufacturers(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            this.manufacturers = data['data'];
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectManufacturer() {
        var manufacturerId = this.manufacturerProductForm.get('manufacturer').value;
        for (let i = 0; i < this.manufacturers.length; i++) {
            if (this.manufacturers[i].id == manufacturerId) {
                this.selectedManufacturer = this.manufacturers[i];
            }
        }
    }

    submitMachine(form){
        this.click=!this.click;
        this.createManufacturerProduct(form);
        $('#manufacturerProductTypeModal').modal('hide');
    }
}
