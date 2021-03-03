import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule , FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { BOARD_MANUFACTURER_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    isSameAddress = false;
    boardManufacturer: any= {};
    cities= [];
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    boardManufacturerForm: FormGroup;
    addressForm: FormGroup;
    adminForm: FormGroup;
    cAddressForm: FormGroup;
    currentPage= 1;
    pageSize= 8;
    query= '';
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    BOARD_MANUFACTURER_VALIDATOR= BOARD_MANUFACTURER_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER,
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CREATE,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CREATE_DESC
    };
    steps= [];

    constructor(
                private router: Router,
                private boardManufacturerService: BoardManufacturerService,
                private alertService: AlertService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
        private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.BOARD_MANUFACTURER_VALIDATOR = BOARD_MANUFACTURER_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_CREATE_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
    }

    ngOnInit() {
        this.boardManufacturerForm = this.createBoardManufacturerForm();
        this.addressForm =  this.boardManufacturerForm.get('address') as FormGroup;
        this.cAddressForm =  this.boardManufacturerForm.get('cAddress') as FormGroup;
        this.adminForm = this.boardManufacturerForm.get('admin') as FormGroup;

    }

    createBoardManufacturerForm(): FormGroup {
        return this.boardManufacturerForm = this._formBuilder.group({
            id          :  new FormControl(this.boardManufacturer.id),
            name        :  new FormControl(this.boardManufacturer.name, [Validators.required, ,Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            description :  new FormControl(this.boardManufacturer.description, [Validators.required, Validators.minLength(3)]),
            sameAddress :  [this.boardManufacturer.sameAddress],
            address     :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.address ? this.boardManufacturer.address : {}),
            cAddress    :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.address ? this.boardManufacturer.address : {}),
            admin       :  this.adminService.getAdminForm(this._formBuilder, this.boardManufacturer.admin ? this.boardManufacturer.admin : {})
        });
    }

    loadCities() {
        var _self = this;
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

    createBoardManufacturer(form) {
        this.boardManufacturer = this.boardManufacturerForm.value;
        $('body').addClass('loading');
        this.boardManufacturer.address.city = this.selectedCity;
        this.boardManufacturer.cAddress.city = this.selectedCorporateCity;
        delete this.boardManufacturer.address.region;
        delete this.boardManufacturer.cAddress.region;
        delete this.boardManufacturer.address.country;
        delete this.boardManufacturer.cAddress.country;
        this.boardManufacturerService.saveBoardManufacturer(this.boardManufacturer)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
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

    list() {
        this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        if (!this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
             this.adminForm.get('confirmPassword').setErrors({'required': true});
             return false;
        }
        if (this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(BOARD_MANUFACTURER_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    loadCorporateCities() {
        var _self = this;
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

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }
}
