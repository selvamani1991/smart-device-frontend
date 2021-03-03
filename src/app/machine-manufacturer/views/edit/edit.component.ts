import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../../constants';
import { MACHINE_MANUFACTURER_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { MachineManufacturerService } from '../../services/machine-manufacturer.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    isSameAddress = false;
    manufacturer: any= {};
    city: any= {};
    manufacturers= [];
    cities= [];
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
    MACHINE_MANUFACTURER_VALIDATOR= MACHINE_MANUFACTURER_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MACHINE_MANUFACTURER,
        pageTitle: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_EDIT,
        pageDesc: MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_EDIT_DESC
    };
    steps= [];
    buttonName= MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_ACTION_EDIT;
    backUrl= MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorManufacturername: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private machineManufacturerService: MachineManufacturerService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MACHINE_MANUFACTURER_CONSTANTS = MACHINE_MANUFACTURER_CONSTANTS;
        this.MACHINE_MANUFACTURER_VALIDATOR = MACHINE_MANUFACTURER_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_LIST_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(MACHINE_MANUFACTURER_CONSTANTS.LABEL.MANUFACTURER_EDIT_LINK, MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_EDIT, false);
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
            logo                  : [this.manufacturer.logo],
            sameAddress           : [this.manufacturer.sameAddress],
            name                  : [this.manufacturer.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.manufacturer.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.manufacturer.address ? this.manufacturer.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.manufacturer.cAddress ? this.manufacturer.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.manufacturer.admin ? this.manufacturer.admin : {})

        });
    }

    updateManufacturer() {
        this.manufacturer = this.manufacturerForm.value;
        $('body').addClass('loading');
        this.manufacturer.address.city = this.selectedCity;
        this.manufacturer.cAddress.city = this.selectedCorporateCity;
        delete this.manufacturer.address.region;
        delete this.manufacturer.cAddress.region;
        delete this.manufacturer.address.country;
        delete this.manufacturer.cAddress.country;
        this.machineManufacturerService.updateManufacturer(this.manufacturer)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == MACHINE_MANUFACTURER_CONSTANTS.FIELD.NAME) {
                this.manufacturerForm.get('name').setErrors({'duplicate': true});
            //}
        }
    }

    loadCities() {
        this.loading = true;
        this.machineManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#manufacturerCitySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
                this.loading = false;
           }
        );
    }

    loadManufacturer(alias) {
        this.machineManufacturerService.getManufacturer(alias)
        .subscribe(
        data => {
            this.manufacturer = data['data'][0];
            this.manufacturerForm = this.createManufacturerForm();
            this.addressForm =  this.manufacturerForm.get('address') as FormGroup;
            this.cAddressForm =  this.manufacturerForm.get('cAddress') as FormGroup;
            this.adminForm = this.manufacturerForm.get('admin') as FormGroup;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    setCity(city) {
        this.selectedCity = city;
        this.addressForm.get('city').setValue(this.selectedCity.name);
        if (this.selectedCity.region) {
            this.addressForm.get('region').setValue(this.selectedCity.region ? this.selectedCity.region.name : '');
        }
        if (this.selectedCity.country) {
            this.addressForm.get('country').setValue(this.selectedCity.country ? this.selectedCity.country.name : '');
        }
        $('#manufacturerCitySelect').hide();
    }

    searchCity(event) {
         let newValue = event.target.value;
         if (newValue && newValue.length >= 3) {
             this.query = newValue;
             this.loadCities();
         } else {
             this.query = '';
             $('#manufacturerCitySelect').hide();
         }
    }

    list() {
        this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        return valid;
    }

    loadCorporateCities() {
        this.loading = true;
        this.machineManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#corporateCitySelect').show();
                this.loading = false;

            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([MACHINE_MANUFACTURER_CONSTANTS.URL.MACHINE_MANUFACTURER_LIST]);
                this.loading = false;
            }
        );
    }

    setCorporateCity(city) {
        this.selectedCorporateCity = city;
        this.cAddressForm.get('city').setValue(this.selectedCorporateCity.name);
        if (this.selectedCorporateCity.region) {
              this.cAddressForm.get('region').setValue(this.selectedCorporateCity.region ? this.selectedCorporateCity.region.name : '');
        }
        if (this.selectedCorporateCity.country) {
            this.cAddressForm.get('country').setValue(this.selectedCorporateCity.country ? this.selectedCorporateCity.country.name : '');
        }
        $('#corporateCitySelect').hide();
    }

    searchCorporateCity(event) {
        let newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
            this.query = newValue;
            this.loadCorporateCities();
        }else {
            this.query = '';
            $('#corporateCitySelect').hide();
        }
    }

    selectCorporateAddress(){
        this.isSameAddress = this.manufacturerForm.get('sameAddress').value;
        if(!this.isSameAddress){
             var addressValue = this.addressForm.value;
             this.cAddressForm.get('houseNumber').setValue(addressValue.houseNumber);
             this.cAddressForm.get('street').setValue(addressValue.street);
             this.cAddressForm.get('landMark').setValue(addressValue.landMark);
             this.selectedCorporateCity=this.selectedCity;
             this.cAddressForm.get('city').setValue(this.selectedCorporateCity.name);

             if (this.selectedCorporateCity.region) {
                   this.cAddressForm.get('region').setValue(this.selectedCorporateCity.region ? this.selectedCorporateCity.region.name : '');
             }
             if (this.selectedCorporateCity.country) {
               this.cAddressForm.get('country').setValue(this.selectedCorporateCity.country ? this.selectedCorporateCity.country.name : '');
             }
             this.cAddressForm.get('zipCode').setValue(addressValue.zipCode);

        }
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }
}
