import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { CLIENT_VALIDATOR } from '../../validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { ClientService } from '../../services/client.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    client: any= {};
    alias: any= {};
    clients: any= [];
    cities: any= [];
    isDistributorSupport= false;
    isSameAddress= false;
    isPayment= false;
    selectedCity: any= {region: '', country: '' , name: ''};
    selectedCorporateCity: any= {region: '', country: '' , name: ''};
    clientForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    vendorDistributor= true;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_CREATE,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_CREATE_DESC
    };
    steps= [];
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_CREATE;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_LIST;
    formValidation= {
    duplicateErrorClientname: false,
    duplicateErrorEmail: false
    };

    constructor(
                private router: Router,
                private clientService: ClientService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_LIST, true);
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_CREATE_LINK, CLIENT_CONSTANTS.URL.CLIENT_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
    }

    ngOnInit() {
        this.clientForm = this.createClientForm();
        this.addressForm =  this.clientForm.get('address') as FormGroup;
        this.cAddressForm =  this.clientForm.get('cAddress') as FormGroup;
        this.adminForm = this.clientForm.get('admin') as FormGroup;
    }

    createClientForm(): FormGroup {
        return this.clientForm = this._formBuilder.group({
            id                      : [this.client.id],
            name                    : [this.client.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description             : [this.client.description, [Validators.required, Validators.minLength(3)]],
            address                 : this.addressService.getAddressForm(this._formBuilder, this.client.address ? this.client.address : {}),
            cAddress                : this.addressService.getAddressForm(this._formBuilder, this.client.address ? this.client.address : {}),
            admin                   : this.adminService.getAdminForm(this._formBuilder, this.client.admin ? this.client.admin : {}),
            productNickName         : [this.client.productNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            productTypeNickName     : [this.client.productTypeNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            vendorNickName          : [{value: this.client.vendorNickName, disabled: !this.isDistributorSupport}, [Validators.required, Validators.minLength(2)]],
            distributorNickName     : [{value: this.client.distributorNickName, disabled: !this.isDistributorSupport}, [Validators.required, Validators.minLength(2)]],
            companyNickName         : [this.client.companyNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            companyBuildingNickName : [this.client.companyBuildingNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            paymentGatewayAPIKey    : [{value: this.client.paymentGatewayAPIKey, disabled: !this.isPayment}, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            paymentSecretKey        : [{value: this.client.paymentSecretKey, disabled: !this.isPayment}, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            distributorSupported    : [false],
            qrCode                  : [false],
            payment                 : [false],
            media                   : [false],
            fota                    : [false],
            sameAddress             : [false],
            mapSupported            : [false],
            emailNotification       : [this.client.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            appUrl:[this.client.appUrl,[Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]]

        });
    }

    createClient() {
        this.client = this.clientForm.value;
        $('body').addClass('loading');
        this.client.address.city = this.selectedCity;
        this.client.cAddress.city = this.selectedCorporateCity;
        delete this.client.address.region;
        delete this.client.address.country;
        delete this.client.cAddress.region;
        delete this.client.cAddress.country;
        this.clientService.saveClient(this.client)
        .subscribe(
        data => {
            $('body').removeClass('loading');

            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }

    loadCities() {
        this.loading = true;
        this.clientService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#citySelect').show();
                this.loading = false;

            },
            error => {
                 this.sweetAlertService.notSuccessful(error.errorMessageCode);
                 this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
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
        }else {
            this.query = '';
            $('#citySelect').hide();
        }
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        //return this.adminService.validateForm() && valid;
        if (!this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
             this.adminForm.get('confirmPassword').setErrors({'required': true});
             return false;
        }
        if (this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(CLIENT_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(CLIENT_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    list() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
    }

    showVendorDistributor() {
        this.isDistributorSupport = this.clientForm.get('distributorSupported').value;
        if (this.isDistributorSupport) {
            this.clientForm.get('vendorNickName').enable();
            this.clientForm.get('distributorNickName').enable();
        }else {
            this.clientForm.get('vendorNickName').disable();
            this.clientForm.get('distributorNickName').disable();

        }
    }

    showPaymentGateWay() {
        this.isPayment = this.clientForm.get('payment').value;
        if (this.isPayment) {
            this.clientForm.get('paymentGatewayAPIKey').enable();
            this.clientForm.get('paymentSecretKey').enable();
        }else {
            this.clientForm.get('paymentGatewayAPIKey').disable();
            this.clientForm.get('paymentSecretKey').disable();

        }
    }

    loadCorporateCities() {
        this.loading = true;
        this.clientService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#corporateCitySelect').show();
                this.loading = false;

            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
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
        }else {
            this.query = '';
            $('#corporateCitySelect').hide();
        }
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CLIENT_CONSTANTS.FIELD.NAME) {
                this.clientForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    selectCorporateAddress(){
        this.isSameAddress = this.clientForm.get('sameAddress').value;
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
