import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { DISTRIBUTOR_VALIDATOR } from '../../validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { DistributorService } from '../../services/distributor.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    isSameAddress = false;
    distributor: any= {};
    client: any= {};
    currentUser=undefined;
    distributors: any= [];
    cities: any= [];
    startDate: any;
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    distributorForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    DISTRIBUTOR_VALIDATOR= DISTRIBUTOR_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_CREATE,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_CREATE_DESC
    };
    steps= [];
        buttonName= DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_ACTION_CREATE;
        backUrl= DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST;
        formValidation= {
        duplicateErrorDistributorname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private distributorService: DistributorService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private authenticationService: AuthenticationService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.DISTRIBUTOR_VALIDATOR = DISTRIBUTOR_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.distributorForm = this.createDistributorForm();
        this.cAddressForm =  this.distributorForm.get('cAddress') as FormGroup;
        this.addressForm =  this.distributorForm.get('address') as FormGroup;
        this.adminForm = this.distributorForm.get('admin') as FormGroup;
        this.loadClient();
    }

    createDistributorForm(): FormGroup {
        this.selectedCity = this.distributor.address ? this.distributor.address.city : {};
        return this.distributorForm = this._formBuilder.group({
            id                    : [this.distributor.id],
            name                  : [this.distributor.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.distributor.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.distributor.address ? this.distributor.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.distributor.address ? this.distributor.address : {}),
            admin                 :  this.adminService.getAdminForm(this._formBuilder, this.distributor.admin ? this.distributor.admin : {}),
            emailNotification     : [this.distributor.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            sameAddress           : [this.distributor.sameAddress]
        });
    }

    loadCities() {
        this.loading = true;
        this.distributorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#distributorCitySelect').show();
                this.loading = false;

            },
            error => {
                    this.sweetAlertService.notSuccessful(error.errorMessageCode);
                    this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
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
        $('#distributorCitySelect').hide();
    }

    searchCity(event) {
        let newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
            this.query = newValue;
            this.loadCities();
        } else {
            this.query = '';
            $('#distributorCitySelect').hide();
        }
    }

    createDistributor() {
        this.distributor = this.distributorForm.value;
        $('body').addClass('loading');
        this.distributor.address.city = this.selectedCity;
        this.distributor.cAddress.city = this.selectedCorporateCity;
        delete this.distributor.address.region;
        delete this.distributor.cAddress.region;
        delete this.distributor.address.country;
        delete this.distributor.cAddress.country;
        this.distributorService.saveDistributor(this.distributor)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                    this.adminService.assignResponseError(data);
                    this.assignResponseError(data);
            } else {
                this.sweetAlertService.createConfirmation(this.client.distributorNickName);
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == DISTRIBUTOR_CONSTANTS.FIELD.NAME) {
                this.distributorForm.get('name').setErrors({'duplicate': true});
            //}
        }
    }

    list() {
        this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
    }

    loadCorporateCities() {
        this.loading = true;
        this.distributorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#corporateCitySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
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
        } else {
            this.query = '';
            $('#corporateCitySelect').hide();
        }
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        if (!this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
             this.adminForm.get('confirmPassword').setErrors({'required': true});
             return false;
        }
        if (this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(DISTRIBUTOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    loadClient() {
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.breadCrumService.pushStep('Create' + ' ' + this.client.distributorNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_CREATE, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    selectCorporateAddress(){
        this.isSameAddress = this.distributorForm.get('sameAddress').value;
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
