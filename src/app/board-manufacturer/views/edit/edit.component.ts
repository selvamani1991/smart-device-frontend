import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
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
    boardManufacturer: any= {};
    city: any= {};
    boardManufacturers= [];
    cities= [];
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    boardManufacturerForm: FormGroup;
    currentPage= 1;
    pageSize= 8;
    query= '';
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    BOARD_MANUFACTURER_VALIDATOR= BOARD_MANUFACTURER_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER,
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_EDIT,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_EDIT_DESC
    };
    steps= [];
    buttonName= BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_ACTION_EDIT;
    backUrl= BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorBoardManufacturername: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private boardManufacturerService: BoardManufacturerService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.BOARD_MANUFACTURER_VALIDATOR = BOARD_MANUFACTURER_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_EDIT_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadBoardManufacturer(this.alias);
        });
    }

    ngOnInit() {
        this.boardManufacturerForm = this.createBoardManufacturerForm();
        this.addressForm =  this.boardManufacturerForm.get('address') as FormGroup;
        this.cAddressForm =  this.boardManufacturerForm.get('cAddress') as FormGroup;
        this.adminForm = this.boardManufacturerForm.get('admin') as FormGroup;

    }

    createBoardManufacturerForm(): FormGroup {
        this.selectedCity = this.boardManufacturer.address ? this.boardManufacturer.address.city : {};
        this.selectedCorporateCity = this.boardManufacturer.cAddress ? this.boardManufacturer.cAddress.city : {};
        return this.boardManufacturerForm = this._formBuilder.group({
            id                    : [this.boardManufacturer.id],
            ownerId               : [this.boardManufacturer.ownerId],
            alias                 : [this.boardManufacturer.alias],
            name                  : [this.boardManufacturer.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.boardManufacturer.description, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.address ? this.boardManufacturer.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.cAddress ? this.boardManufacturer.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.boardManufacturer.admin ? this.boardManufacturer.admin : {}),
            logo                  : [this.boardManufacturer.logo],
            sameAddress           : [this.boardManufacturer.sameAddress],
        });
    }

    updateBoardManufacturer() {
        this.boardManufacturer = this.boardManufacturerForm.value;
        $('body').addClass('loading');
        this.boardManufacturer.address.city = this.selectedCity;
        this.boardManufacturer.cAddress.city = this.selectedCorporateCity;
        delete this.boardManufacturer.address.region;
        delete this.boardManufacturer.cAddress.region;
        delete this.boardManufacturer.address.country;
        delete this.boardManufacturer.cAddress.country;
        this.boardManufacturerService.updateBoardManufacturer(this.boardManufacturer)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    loadCities() {
        this.loading = true;
        this.boardManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#citySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
                this.loading = false;
           }
        );
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
        $('#citySelect').hide();
    }

    searchCity(event) {
        var newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
           this.query = newValue;
           this.loadCities();
        } else {
           this.query = '';
           $('#citySelect').hide();
        }
    }

    loadBoardManufacturer(alias) {
        this.boardManufacturerService.getBoardManufacturer(alias)
        .subscribe(
        data => {
            this.boardManufacturer = data['data'][0];
            this.boardManufacturerForm = this.createBoardManufacturerForm();
            this.addressForm =  this.boardManufacturerForm.get('address') as FormGroup;
            this.cAddressForm =  this.boardManufacturerForm.get('cAddress') as FormGroup;
            this.adminForm = this.boardManufacturerForm.get('admin') as FormGroup;

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    list() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
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
        this.boardManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#corporateCitySelect').show();
                this.loading = false;

            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
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
        var newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
            this.query = newValue;
            this.loadCorporateCities();
        } else {
            this.query = '';
            $('#corporateCitySelect').hide();
        }
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == BOARD_MANUFACTURER_CONSTANTS.FIELD.NAME) {
                this.boardManufacturerForm.get('name').setErrors({'duplicate': true});
            //}
        }
    }

    selectCorporateAddress(){
        this.isSameAddress = this.boardManufacturerForm.get('sameAddress').value;
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
}
