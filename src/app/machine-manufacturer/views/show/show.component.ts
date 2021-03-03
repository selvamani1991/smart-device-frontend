import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { MachineManufacturerService} from '../../services/machine-manufacturer.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    manufacturer: any= {};
    formatError= false;
    files: any= [];
    services: any= [];
    cities: any= [];
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    manufacturerForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    MACHINE_MANUFACTURER_CONSTANTS= MACHINE_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_IMAGE,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_SHOW,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_SHOW_DESC
    };

    alias: any;
    formValidation= {
        duplicateErrorManufacturerName: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private machineManufacturerService: MachineManufacturerService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_SHOW_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadManufacturer(this.alias);
        });
    }

    ngOnInit() {
        this.manufacturerForm = this.createManufacturerForm();
        this.addressForm =  this.manufacturerForm.get('address') as FormGroup;
        this.cAddressForm =  this.manufacturerForm.get('cAddress') as FormGroup;
        this.adminForm = this.manufacturerForm.get('admin') as FormGroup;
    }

    createManufacturerForm(): FormGroup {
        this.selectedCity = this.manufacturer.address ? this.manufacturer.address.city : {};
        this.selectedCorporateCity = this.manufacturer.cAddress ? this.manufacturer.cAddress.city : {};
        return this.manufacturerForm = this._formBuilder.group({
            id                    : [this.manufacturer.id],
            ownerId               : [this.manufacturer.ownerId],
            alias                 : [this.manufacturer.alias],
            name                  : [this.manufacturer.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description           : [this.manufacturer.description, [Validators.required, Validators.minLength(3)]],
            emailNotification     : [this.manufacturer.emailNotification, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.manufacturer.address ? this.manufacturer.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.manufacturer.cAddress ? this.manufacturer.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.manufacturer.admin ? this.manufacturer.admin : {})

        });
    }

    loadCities() {
        this.machineManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            this.loading = false;

        },
        () => {
                this.loading = false;
           }
        );
    }

    loadManufacturer(alias) {
         $('body').addClass('loading');
        this.machineManufacturerService.getManufacturer(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.manufacturer = data['data'][0];
            this.manufacturerForm = this.createManufacturerForm();
            this.addressForm =  this.manufacturerForm.get('address') as FormGroup;
            this.cAddressForm =  this.manufacturerForm.get('cAddress') as FormGroup;
            this.adminForm = this.manufacturerForm.get('admin') as FormGroup;

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    processFile() {
        this.machineManufacturerService.uploadImage(this.files, this.manufacturer.id)
        .subscribe(
        data => {
            this.manufacturer = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            this.assignResponseError(error);
        });
    }

    assignResponseError(error){
        if (error.error.error.errorCode == ERROR_CODE.code_25) {
              this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
        }

    }

    onFileChange(event) {
        this.files = event.target.files[0];
        let pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }

    loadCorporateCities() {
         this.machineManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
         .subscribe(
         data => {
             this.cities = data['data'];
             this.loading = false;

         },
         () => {
                 this.loading = false;
            }
         );
    }

    markDeleted(manufacturer) {
       this.sweetAlertService.deleteCheck(this, manufacturer);
    }

    remove(manufacturer) {
        manufacturer.logo=null;
        this.machineManufacturerService.deleteProfilePicture(manufacturer)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteImage(this.setting.entity);
            }
        },
        error => {
            this.loading = false;
        });
    }
}
