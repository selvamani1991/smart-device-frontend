import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { COMPANY_VALIDATOR } from '../../validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
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
    isSameAddress = false;
    submitted = false;
    zones: any= [];
    vendorZones: any= [];
    selectedZone= {id: 0,alias: ''};
    company: any= {};
    client: any= {};
    cities: any= [];
    vendor: any= {};
    distributor: any= {};
    endDate: any;
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    currentUser=undefined;
    companyForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    COMPANY_VALIDATOR= COMPANY_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_CREATE,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_CREATE_DESC
    };
    steps= [];
        buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_CREATE;
        backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
        formValidation= {
        duplicateErrorCompanyname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private router: Router,
                private companyService: CompanyService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
        private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        this.COMPANY_VALIDATOR = COMPANY_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;


        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );

    }

    ngOnInit() {
        this.companyForm = this.createCompanyForm();
        this.addressForm =  this.companyForm.get('address') as FormGroup;
        this.cAddressForm =  this.companyForm.get('cAddress') as FormGroup;
        this.adminForm = this.companyForm.get('admin') as FormGroup;
        this.loadZones();
        this.loadClient();
        $('#zoneCompanySelect').select2({
           width: '100%'
        });

    }

    createCompanyForm(): FormGroup {
        if(this.currentUser.userType=='clientAdmin'){
            return this.companyForm = this._formBuilder.group({
                id                    : [this.company.id],
                name                  : [this.company.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.company.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                address               : this.addressService.getAddressForm(this._formBuilder, this.company.address ? this.company.address : {}),
                cAddress              : this.addressService.getAddressForm(this._formBuilder, this.company.address ? this.company.address : {}),
                admin                 : this.adminService.getAdminForm(this._formBuilder, this.company.admin ? this.company.admin : {}),
                zoneId                : ['', [Validators.required]],
                sameAddress           : [this.company.sameAddress],
                emailNotification     : [this.company.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            });
        }
        if(this.currentUser.userType!='clientAdmin'){
            return this.companyForm = this._formBuilder.group({
                id                    : [this.company.id],
                name                  : [this.company.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
                description           : [this.company.description, [Validators.required, Validators.minLength(3)]],
                address               : this.addressService.getAddressForm(this._formBuilder, this.company.address ? this.company.address : {}),
                cAddress              : this.addressService.getAddressForm(this._formBuilder, this.company.address ? this.company.address : {}),
                admin                 : this.adminService.getAdminForm(this._formBuilder, this.company.admin ? this.company.admin : {}),
                emailNotification     : [this.company.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
                sameAddress           : [this.company.sameAddress],
            });
        }

    }

    loadZones() {
        var _self = this;
        this.companyService.getCompanyZones(this.currentUser.ownerId)
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
                $('#zoneCompanySelect').select2({
                    width: '100%'
                });
                $('#zoneCompanySelect').on('select2:select', function(e){
                    var selectId = e.params.data.id;
                    _self.selectZone(selectId);
                    if (selectId > 0) {
                        _self.companyForm.get('zoneId').setErrors(null);
                    }else {
                        _self.companyForm.get('zoneId').setErrors({'required': true});
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
            if (this.zones[i].id == zoneId) {
                this.selectedZone = this.zones[i].alias;
                this.companyForm.get('zoneId').setErrors(null);
            }
        }
    }

    createCompany(form) {
        this.company = this.companyForm.value;
        $('body').addClass('loading');
        if (this.currentUser.userType=='clientAdmin'){
            this.company.zoneId = this.selectedZone;
        }
        this.company.address.city = this.selectedCity;
        this.company.cAddress.city = this.selectedCorporateCity;
        delete this.company.address.region;
        delete this.company.cAddress.region;
        delete this.company.address.country;
        delete this.company.cAddress.country;
        this.companyService.saveCompany(this.company)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            }else {
                this.sweetAlertService.createConfirmation(this.client.companyNickName);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == COMPANY_CONSTANTS.FIELD.NAME) {
                this.companyForm.get('name').setErrors({'duplicate': true});
            //}
        }
    }

    list() {
        this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
    }

    validateForm() {
        let valid = true;
        if(this.currentUser.userType=='clientAdmin'){
            if (this.selectedZone.id == 0){
                this.companyForm.get('zoneId').setErrors({'required': true});
                valid = false;
            }else {
                this.companyForm.get('zoneId').setErrors(null);
            }

        }

        if (this.selectedCity.id == 0) {
            this.addressForm.get('city').setErrors({'required': true});
            valid = false;
        }
        if (!this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
             this.adminForm.get('confirmPassword').setErrors({'required': true});
             return false;
        }
        if (this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            if (this.adminForm.get(COMPANY_CONSTANTS.FIELD.PASSWORD).value === this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).value){
                this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
            }else{
                this.adminForm.get(COMPANY_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
                valid = false;
            }
            return valid;
        }
    }

    loadCities() {
        this.loading = true;
        this.companyService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#companyCitySelect').show();
                this.loading = false;
            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
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
        $('#companyCitySelect').hide();
    }

    searchCity(event) {
        var newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
            this.query = newValue;
            this.loadCities();
        }else {
            this.query = '';
            $('#companyCitySelect').hide();
        }
    }

    loadCorporateCities() {
        this.loading = true;
        this.companyService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#corporateCitySelect').show();
                this.loading = false;
            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
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

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
           this.breadCrumService.pushStep('Create' + ' ' + this.client.companyNickName, COMPANY_CONSTANTS.URL.COMPANY_CREATE, false);
           this.steps = this.breadCrumService.getSteps();

        },
        () => {
           this.loading = false;
        });
    }

    selectCorporateAddress(){
        this.isSameAddress = this.companyForm.get('sameAddress').value;
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
