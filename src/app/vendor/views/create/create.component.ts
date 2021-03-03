import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { VendorService } from '../../services/vendor.service';
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
    vendor: any= {};
    vendors: any= [];
    client:any={};
    currentUser=undefined;
    cities: any= [];
    startDate: any;
    alias: any= {};
    zone: any= {};
    zones: any= [];
    currentPage= 1;
    pageSize= 8;
    query= '';
    selectedZone= {id: 0, alias: ''};
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {region: '', country: '' , name: ''};
    vendorForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    VENDOR_VALIDATOR= VENDOR_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_CREATE,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_CREATE_DESC
    };
    steps= [];
        buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_CREATE;
        backUrl= VENDOR_CONSTANTS.URL.VENDOR_LIST;
        formValidation= {
        duplicateErrorVendorname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private vendorService: VendorService,
                private adminService: AdminService,
                private addressService: AddressService,
                private authenticationService: AuthenticationService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.VENDOR_VALIDATOR = VENDOR_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(VENDOR_CONSTANTS.LABEL.VENDOR_LIST_LINK,VENDOR_CONSTANTS.URL.VENDOR_LIST,true);
        breadCrumService.pushStep(VENDOR_CONSTANTS.LABEL.VENDOR_CREATE_LINK, VENDOR_CONSTANTS.URL.VENDOR_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;

        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.vendorForm = this.createVendorForm();
        this.addressForm =  this.vendorForm.get('address') as FormGroup;
        this.cAddressForm =  this.vendorForm.get('cAddress') as FormGroup;
        this.adminForm = this.vendorForm.get('admin') as FormGroup;
        this.loadClient();
        this.loadZones();
        $('#zoneSelect').select2({
            width: '100%'
        });
    }

    createVendorForm(): FormGroup {
        return this.vendorForm = this._formBuilder.group({
            id                    : [this.vendor.id],
            name                  : [this.vendor.name, [Validators.required,Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.vendor.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            emailNotification     : [this.vendor.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.vendor.address ? this.vendor.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.vendor.address ? this.vendor.address : {}),
            admin                 :  this.adminService.getAdminForm(this._formBuilder, this.vendor.admin ? this.vendor.admin : {}),
            zoneId                : ['', [Validators.required]],
            sameAddress          : [this.vendor.sameAddress],
        });
    }


    createVendor() {
        this.vendor = this.vendorForm.value;
        $('body').addClass('loading');
        this.vendor.zoneId = this.selectedZone;
        this.vendor.address.city = this.selectedCity;
        this.vendor.cAddress.city = this.selectedCorporateCity;
        delete this.vendor.address.region;
        delete this.vendor.cAddress.region;
        delete this.vendor.address.country;
        delete this.vendor.cAddress.country;
        delete this.vendor.sameAddress;
        this.vendorService.saveVendor(this.vendor)
        .subscribe(
        data => {
        $('body').removeClass('loading');
            if (data['hasError']) {
                    this.adminService.assignResponseError(data);
                    this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.client.vendorNickName);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.vendorForm.get('name').setErrors({'duplicate': true});
        }
    }

    loadZones() {
        var _self = this;
        this.vendorService.getCompanyZones(this.currentUser.ownerId)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.zones = data['data'];
                var activeZones=[];
                for(let i=0; i<this.zones.length; i++){
                     if(this.zones[i].active){
                         activeZones.push(this.zones[i])
                     }
                }
                this.zones=activeZones;
                $('#zoneSelect').select2({
                    width: '100%'
                });
                $('#zoneSelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectZone(selectId);
                    if (selectId > 0) {
                        _self.vendorForm.get('zoneId').setErrors(null);
                   }else {
                        _self.vendorForm.get('zoneId').setErrors({'required': true});
                    }
                })

            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    selectZone(zoneId) {
        for (var i = 0; i < this.zones.length; i++){
            if (this.zones[i].id == zoneId){
                this.selectedZone = this.zones[i].alias;
                this.vendorForm.get('zoneId').setErrors(null);
            }
        }
    }

    validateForm(form) {
        let valid = true;
        if (this.selectedZone.id == 0){
            this.vendorForm.get('zoneId').setErrors({'required': true});
            valid = false;
        }else {
            this.vendorForm.get('zoneId').setErrors(null);
        }
        return true;

    }

    list() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
    }

    loadCities() {
        this.loading = true;
        this.vendorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#citySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
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

    loadCorporateCities() {
        this.loading = true;
        this.vendorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#corporateCitySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
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

    validatePassword(form) {
        let valid = true;
        if (!this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
             this.adminForm.get('confirmPassword').setErrors({'required': true});
             return false;
        }
        if (this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(VENDOR_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(VENDOR_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' +'List',VENDOR_CONSTANTS.URL.VENDOR_LIST,true);
           this.breadCrumService.pushStep('Create' + ' ' +this.client.vendorNickName, VENDOR_CONSTANTS.URL.VENDOR_CREATE, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    selectCorporateAddress(){
        this.isSameAddress = this.vendorForm.get('sameAddress').value;
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
