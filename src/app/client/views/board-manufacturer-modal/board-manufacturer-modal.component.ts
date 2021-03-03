import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_VALIDATOR } from '../../validator';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientService } from '../../services/client.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    selector: 'board-manufacturer-modal',
    moduleId: module.id.toString(),
    templateUrl: 'board-manufacturer-modal.component.html'
})

export class BoardManufacturerModalComponent implements OnInit {
    boardProductType: any= {};
    assignedDate: any;
    boardProductTypeForm: FormGroup;
    boardManufacturers: any= [];
    boardManufacturerObj: any= {};
    @Input() productType;
    @Output() submitEvent = new EventEmitter<number>();
    selectedBoardManufacturer: any = {id: 0};
    loading = false;
    click = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    alias: any;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.BOARD_PRODUCT_TYPE,
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
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);
    }

    ngOnInit() {
        let self = this;
        this.boardProductTypeForm = this.createBoardProductTypeForm();
        $('#boardManufacturerModal').on('hidden.bs.modal', function(){
            self.boardProductTypeForm = self.createBoardProductTypeForm();
            self.loadBoardManufacturers();
        });

        $('#boardManufacturerDispatchedDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: (selectedDate) => {
                this.assignedDate = selectedDate;
                this.boardProductTypeForm.get('assignedDate').setErrors(null);
            }
        });
        this.loadBoardManufacturers();
        $('#board-manufacturer-select').select2({
            width: '100%'
        });
    }

    createBoardProductTypeForm(): FormGroup {
        return this.boardProductTypeForm = this._formBuilder.group({
            boardManufacturer        : [0,[Validators.required]],
            assignedDate             : ['',[Validators.required]],
            productCount             : ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
    }

    createBoardProductType(form) {
        this.boardManufacturerObj = this.boardProductTypeForm.value;
        $('body').addClass('loading');
        this.boardProductType = {
            boardManufacturer    : this.selectedBoardManufacturer,
            productType          : this.productType,
            productCount         : this.boardManufacturerObj.productCount,
            status               : 'New'
        };
        this.boardProductType.assignedDate = this.dateService.getLongFromString(this.assignedDate);
        this.clientService.saveBoardProductType(this.boardProductType)
         .subscribe(
             data => {
                 $('body').removeClass('loading');
                 if (data['hasError']) {
                 } else {
                     this.sweetAlertService.createConfirmation(this.setting.entity);
                     this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_PRODUCT_TYPE_BOARD, this.productType.alias]);
                     form.resetForm();
                     $('#boardManufacturerModal').modal('hide');
                     this.submitEvent.emit(1);
                 }
                 this.loading = false;

             },
             failure => {
                  $('body').removeClass('loading');
                  this.httpResponseService.showErrorResponse(failure);
                  this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST, this.productType.alias]);
                  form.resetForm();
                  $('#boardManufacturerModal').modal('hide');
                  this.loading = false;

             }
         );
    }

    loadBoardManufacturers() {
         let _self = this;
         this.loading = true;
         this.clientService.getAllBoardManufacturers()
         .subscribe(
         data => {
             this.boardManufacturers = data['data'];
             var activeBoardManufacturers=[];
             for(let i=0; i<this.boardManufacturers.length; i++){
                 if(this.boardManufacturers[i].active){
                     activeBoardManufacturers.push(this.boardManufacturers[i])
                 }
             }
             this.boardManufacturers=activeBoardManufacturers;
             $('#board-manufacturer-select').select2({
                width: '100%'
             });
             $('#board-manufacturer-select').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectBoardManufacturer(selectId);
             });
         },
         error => {
              this.alertService.error(error.message);
              this.loading = false;
         });
    }

    selectBoardManufacturer(boardManufacturerId) {
        for (let i = 0; i < this.boardManufacturers.length; i++) {
            if (this.boardManufacturers[i].id == boardManufacturerId) {
                this.selectedBoardManufacturer = this.boardManufacturers[i];
                 this.boardProductTypeForm.get('boardManufacturer').setErrors(null);
            }
        }
    }

    validateForm(f) {
        let error = true;
        if (this.selectedBoardManufacturer.id === 0) {
            f.form.controls['boardManufacturer'].setErrors({'required': true});
            error = false;
        }
        if (!this.assignedDate) {
            f.form.controls['assignedDate'].setErrors({'required': true});
            error = false;
        }
        return error;
    }

    createBoard(form){
        this.click = !this.click;
        this.createBoardProductType(form);
        $('#boardManufacturerModal').modal('hide');
    }
}
