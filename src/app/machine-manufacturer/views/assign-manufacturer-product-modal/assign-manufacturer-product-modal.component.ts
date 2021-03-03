import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../../machine-manufacturer/constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MachineManufacturerProductService } from '../../services/machine-manufacturer-product.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    selector: 'assign-manufacturer-product-modal',
    moduleId: module.id.toString(),
    templateUrl: 'assign-manufacturer-product-modal.component.html'
})

export class AssignManufacturerProductModalComponent implements OnInit {
    boards: any= [];
    clientProductObj: any= {};
    clientProduct: any= {};
    clients: any= [];
    clientProductForm: FormGroup;
    @Input() product;
    @Output() submitEvent = new EventEmitter<number>();
    selectedClient: any = {};
    loading = false;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    buttonName= MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_ACTION_CREATE;
    buttonName1= MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_ACTION_EDIT;
    backUrl= MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST;
    constructor(
                private router: Router,
                private alertService: AlertService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private machineManufacturerProductService: MachineManufacturerProductService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER);
    }

    ngOnInit() {
        this.clientProductForm = this.createClientProductForm();
        this.loadClients();
    }

    createClientProductForm(): FormGroup {
        return this.clientProductForm = this._formBuilder.group({
            client              : [0],
            dispatchDate        : ['']
        });
    }

    createClientProduct() {
        this.clientProductObj = this.clientProductForm.value;
        $('body').addClass('loading');
        this.clientProduct = {
            client : this.selectedClient,
            product: this.product,
            status: 'New'
        };
        this.machineManufacturerProductService.saveClientProduct(this.clientProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                $('#manufacturerProductModal').modal('hide');
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_MANUFACTURER_PRODUCT]);
            this.loading = false;
        });
    }

    loadClients() {
        this.loading = true;
        this.machineManufacturerProductService.getClients(this.currentPage, this.pageSize)
        .subscribe(
        data => {
            this.clients = data['data'];
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    selectClient() {
        let clientId = this.clientProductForm.get('client').value;
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id == clientId) {
                this.selectedClient = this.clients[i];
            }
        }
    }
}
