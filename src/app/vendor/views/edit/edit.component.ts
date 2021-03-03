import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { VENDOR_VALIDATOR } from '../../validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { VendorService } from '../../services/vendor.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    isSameAddress = false;
    vendor: any= {};
    client: any= {};
    zones: any= [];
    selectedZone= '';
    vendorForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    currentUser=undefined;
    cities= [];
    city: any= {};
    distributor: any= {};
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    VENDOR_VALIDATOR= VENDOR_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: VENDOR_CONSTANTS.LABEL.VENDOR,
        pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_EDIT,
        pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_EDIT_DESC
    };
    steps= [];
    buttonName= VENDOR_CONSTANTS.LABEL.VENDOR_ACTION_EDIT;
    backUrl= VENDOR_CONSTANTS.URL.VENDOR_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorVendorname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private vendorService: VendorService,
                private adminService: AdminService,
                private addressService: AddressService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.VENDOR_VALIDATOR = VENDOR_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.VENDOR_CONSTANTS.LABEL.VENDOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadVendor(this.alias);
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
    }

    createVendorForm(): FormGroup {
        this.selectedCity = this.vendor.address ? this.vendor.address.city : {};
        this.selectedCorporateCity = this.vendor.cAddress ? this.vendor.cAddress.city : {};
        this.selectedZone = this.vendor.zoneId ? this.vendor.zoneId : '';
        return this.vendorForm = this._formBuilder.group({
            id                    : [this.vendor.id],
            ownerId               : [this.vendor.ownerId],
            alias                 : [this.vendor.alias],
            logo                  : [this.vendor.logo],
            productionRevenue     : [this.vendor.productionRevenue],
            salesRevenue          : [this.vendor.salesRevenue],
            subscriptionRevenue   : [this.vendor.subscriptionRevenue],
            subscriptionCount     : [this.vendor.subscriptionCount],
            distributorAndCompanyCount          : [this.vendor.distributorAndCompanyCount],
            emailNotification     : [this.vendor.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            name                  : [this.vendor.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.vendor.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.vendor.address ? this.vendor.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.vendor.cAddress ? this.vendor.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.vendor.admin ? this.vendor.admin : {}),
            zoneId                : [this.vendor.zoneId ? this.selectedZone : '', [Validators.required]],
            productCount          : [this.vendor.productCount],
            sameAddress          : [this.vendor.sameAddress],


        });

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
                    _self.selectedZone=selectId;
                    if(_self.selectedZone.length > 0 ){
                        _self.vendorForm.get('zoneId').setErrors(null);
                    }
                    else {
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
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].alias == zoneId) {
                this.selectedZone = this.zones[i].alias;
                this.vendorForm.get('zoneId').setErrors(null);
            }
        }
    }

    updateVendor() {
        this.vendor = this.vendorForm.value;
        $('body').addClass('loading');
        this.vendor.zoneId = this.selectedZone;
        this.vendor.address.city = this.selectedCity;
        this.vendor.cAddress.city = this.selectedCorporateCity;
        delete this.vendor.address.region;
        delete this.vendor.cAddress.region;
        delete this.vendor.address.country;
        delete this.vendor.cAddress.country;
        this.vendorService.updateVendor(this.vendor)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.vendorNickName);
                this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            this.vendorForm.get('name').setErrors({'duplicate': true});
        }
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

    loadVendor(alias) {
        this.vendorService.getVendor(alias)
        .subscribe(
        data => {
            this.vendor = data['data'][0];
            this.vendorForm = this.createVendorForm();
            this.addressForm =  this.vendorForm.get('address') as FormGroup;
            this.cAddressForm =  this.vendorForm.get('cAddress') as FormGroup;
            this.adminForm = this.vendorForm.get('admin') as FormGroup;

        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
        });
    }

    list() {
        this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
    }

    validateForm() {
        let valid = true;
        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        return valid;
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
        if (this.selectedCorporateCity.region){
            this.cAddressForm.get('region').setValue(this.selectedCorporateCity.region ? this.selectedCorporateCity.region.name : '');
        }
        if (this.selectedCorporateCity.country){
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

    loadClient() {
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.vendorNickName + ' ' +'List',VENDOR_CONSTANTS.URL.VENDOR_LIST,true);
            this.breadCrumService.pushStep('Edit' + ' ' +  this.client.vendorNickName, VENDOR_CONSTANTS.URL.VENDOR_EDIT, false);
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

}
