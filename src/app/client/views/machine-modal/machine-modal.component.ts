import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_VALIDATOR } from '../../validator';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'machine-modal',
    moduleId: module.id.toString(),
    templateUrl: 'machine-modal.component.html'
})
export class MachineModalComponent implements OnInit {
    clients: any= [];
    manufacturers: any= [];
    productTypeObj: any= {};
    machine: any= {};
    assignedDate: any;
    productTypes: any= [];
    selectedProductType= {};
    machineProductTypeForm: FormGroup;
    machineObj: any= {};
    machines: any= [];
    machineProductType: any= {};
    @Input() productType;
    @Output() submitEvent = new EventEmitter<number>();
    selectedManufacturer: any = {id: 0};
    loading = false;
    click = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.MACHINE_PRODUCT_TYPE,
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
                private httpResponseService: HttpResponseService,
                private _formBuilder: FormBuilder,
                private clientService: ClientService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
          this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
          this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
    }

    ngOnInit() {
        var self = this;
        this.machineProductTypeForm = this.createMachineProductTypeForm();
        $('#machineModal').on('hidden.bs.modal', function(){
            self.machineProductTypeForm = self.createMachineProductTypeForm();
            self.loadManufacturers();
        });

        $('#manufacturerAssignedDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.assignedDate = selectedDate;
                this.machineProductTypeForm.get('assignedDate').setErrors(null);
            }
        });
        this.loadManufacturers();
    }

    createMachineProductTypeForm(): FormGroup {
        return this.machineProductTypeForm = this._formBuilder.group({
            manufacturer           : [0],
            assignedDate           : [''],
            productCount           : ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
    }

    createMachineProductType(form) {
        this.machineObj = this.machineProductTypeForm.value;
        $('body').addClass('loading');
        this.machineProductType = {
            manufacturer         : this.selectedManufacturer,
            productType          : this.productType,
            productCount         : this.machineObj.productCount,
            status               : 'New'
        };
        this.machineProductType.assignedDate = this.dateService.getLongFromString(this.assignedDate);
        this.clientService.saveMachineProductType(this.machineProductType)
         .subscribe(
             data => {
                 $('body').removeClass('loading');
                 if (data['hasError']) {
                 } else {
                    this.sweetAlertService.createConfirmation(this.setting.entity);
                    this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_MACHINE, this.productType.alias]);
                    form.resetForm();
                    $('#machineModal').modal('hide');
                    this.submitEvent.emit(1);
                 }
                 this.loading = false;

             },
             failure => {
                  this.httpResponseService.showErrorResponse(failure);
                  this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_MACHINE, this.productType.alias]);
                  form.resetForm();
                  $('#machineModal').modal('hide');
                  this.loading = false;
             }
         );
    }

    loadManufacturers() {
         var _self = this;
         this.loading = true;
         this.clientService.getAllManufacturers()
         .subscribe(
         data => {
             this.manufacturers = data['data'];
             var activeManufacturers=[];
             for(let i=0; i<this.manufacturers.length; i++){
                  if(this.manufacturers[i].active){
                       activeManufacturers.push(this.manufacturers[i])
                  }
             }
             this.manufacturers=activeManufacturers;
             $('#machine-select').select2({
                width: '100%'
             });
             $('#machine-select').on('select2:select', function(e){
                var selectId = e.params.data.id;
                _self.selectManufacturer(selectId);
             });
         },
         error => {
              this.alertService.error(error.message);
              this.loading = false;
         });
    }

    selectManufacturer(manufacturerId) {
        for (let i = 0; i < this.manufacturers.length; i++) {
            if (this.manufacturers[i].id == manufacturerId) {
                this.selectedManufacturer = this.manufacturers[i];
                this.machineProductTypeForm.get('manufacturer').setErrors(null);
            }
        }
    }

    validateForm(f) {
        var error = true;
        if (this.selectedManufacturer.id == 0) {
            f.form.controls['manufacturer'].setErrors({'required': true});
            error = false;
        }
        if (!this.assignedDate) {
            f.form.controls['assignedDate'].setErrors({'required': true});
            error = false;
        }
        return error;
    }

    submitMachine(form){
        this.click=!this.click;
        this.createMachineProductType(form);
        $('#machineModal').modal('hide');
    }
}
