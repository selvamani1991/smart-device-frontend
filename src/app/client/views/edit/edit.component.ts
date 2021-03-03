import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { CLIENT_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
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
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    client: any= {};
    clients: any= [];
    clientObj: any= [];
    files: any= [];
    clientForm: FormGroup;
    addressForm: FormGroup;
    adminForm: FormGroup;
    cAddressForm: FormGroup;
    isDistributorSupport= false;
    isPayment= false;
    isSameAddress= false;
    cities= [];
    city: any= {};
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {region: '', country: '' , name: ''};
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_EDIT,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_EDIT_DESC
    };
    steps= [];
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query: '';
    buttonName= CLIENT_CONSTANTS.LABEL.CLIENT_ACTION_EDIT;
    backUrl= CLIENT_CONSTANTS.URL.CLIENT_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorClientname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private clientService: ClientService,
                private adminService: AdminService,
                private addressService: AddressService,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_LIST, true);
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_EDIT_LINK, CLIENT_CONSTANTS.URL.CLIENT_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadClient(this.alias);
        });
    }

    ngOnInit() {
        this.clientForm = this.createClientForm();
        this.addressForm =  this.clientForm.get('address') as FormGroup;
        this.cAddressForm =  this.clientForm.get('cAddress') as FormGroup;
        this.adminForm = this.clientForm.get('admin') as FormGroup;
    }

    createClientForm(): FormGroup {
        this.selectedCity = this.client.address ? this.client.address.city : {};
        this.selectedCorporateCity = this.client.cAddress ? this.client.cAddress.city : {};
        return this.clientForm = this._formBuilder.group({
            id                      : [this.client.id],
            alias                   : [this.client.alias],
            name                    : [this.client.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description             : [this.client.description, [Validators.required, Validators.minLength(3)]],
            address                 :  this.addressService.getAddressForm(this._formBuilder, this.client.address ? this.client.address : {}),
            cAddress                :  this.addressService.getAddressForm(this._formBuilder, this.client.cAddress ? this.client.cAddress : {}),
            admin                   :  this.adminService.getAdminEditForm(this._formBuilder, this.client.admin ? this.client.admin : {}),
            productNickName         : [this.client.productNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            productTypeNickName     : [this.client.productTypeNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            vendorNickName          : [this.client.vendorNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            distributorNickName     : [this.client.distributorNickName, [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            paymentGatewayAPIKey    : [this.client.paymentGatewayAPIKey,  [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            paymentSecretKey        : [this.client.paymentSecretKey,  [Validators.required, Validators.minLength(2),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            companyNickName         : [this.client.companyNickName,[Validators.required]],
            companyBuildingNickName : [this.client.companyBuildingNickName,[Validators.required]],
            distributorSupported    : [this.client.distributorSupported,[Validators.required]],
            qrCode                  : [this.client.qrCode],
            payment                 : [this.client.payment],
            media                   : [this.client.media],
            fota                    : [this.client.fota],
            emailNotification       : [this.client.emailNotification,[Validators.required,Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            logo                    : [this.client.logo],
            productCount            : [this.client.productCount],
            subscriptionCount       : [this.client.subscriptionCount],
            subscriptionRevenue     : [this.client.subscriptionRevenue],
            salesRevenue            : [this.client.salesRevenue],
            productionRevenue       : [this.client.productionRevenue],
            sameAddress             : [this.client.sameAddress],
            mapSupported            : [this.client.mapSupported],
            appUrl:[this.client.appUrl,[Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]]


        });
    }

    updateClient() {
        this.client = this.clientForm.value;
        $('body').addClass('loading');
        this.client.address.city = this.selectedCity;
        this.client.cAddress.city = this.selectedCorporateCity;
        delete this.client.address.region;
        delete this.client.address.country;
        delete this.client.cAddress.region;
        delete this.client.cAddress.country;
        this.clientService.updateClient(this.client)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.client = data['data'];
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            }
            this.loading = false;
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
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

    showPaymentGateWay() {
        this.isPayment = this.clientForm.get('payment').value == true;
        if (this.isPayment) {
            this.clientForm.get('paymentGatewayAPIKey').enable();
            this.clientForm.get('paymentSecretKey').enable();
        }else {
            this.clientForm.get('paymentGatewayAPIKey').disable();
            this.clientForm.get('paymentSecretKey').disable();

        }
    }

    showVendorDistributor() {
        this.isDistributorSupport = this.clientForm.get('distributorSupported').value == true;
        if (this.isDistributorSupport) {
            this.clientForm.get('vendorNickName').enable();
            this.clientForm.get('distributorNickName').enable();
        }else {
            this.clientForm.get('vendorNickName').disable();
            this.clientForm.get('distributorNickName').disable();

        }
    }

    loadClient(alias) {
        var _self=this;
        this.clientService.getClient(alias)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.isPayment= this.client.payment;
            this.isDistributorSupport = this.client.distributorSupported;
            this.clientForm = this.createClientForm();
            this.addressForm =  this.clientForm.get('address') as FormGroup;
            this.cAddressForm =  this.clientForm.get('cAddress') as FormGroup;
            this.adminForm = this.clientForm.get('admin') as FormGroup;
            setTimeout(function(){
                _self.showVendorDistributor();
            },500);
            setTimeout(function(){
                _self.showPaymentGateWay();
            },500);

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        return valid;
    }

    list() {
        this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
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
