import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { COMPANY_BUILDING_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { CompanyBuildingService } from '../../services/company-building.service';
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
    companyBuilding: any= {};
    city: any= {};
    client: any= {};
    currentUser=undefined;
    companyBuildings= [];
    cities= [];
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    companyBuildingForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    COMPANY_BUILDING_VALIDATOR= COMPANY_BUILDING_VALIDATOR;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    setting = {
        entity: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING,
        pageTitle: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_EDIT,
        pageDesc: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_EDIT_DESC
    };
    steps= [];
    buttonName= COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_ACTION_EDIT;
    backUrl= COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorCompanyBuildingname: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private companyBuildingService: CompanyBuildingService,
                private adminService: AdminService,
                private addressService: AddressService,
                private authenticationService: AuthenticationService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.COMPANY_BUILDING_VALIDATOR = COMPANY_BUILDING_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCompanyBuilding(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.companyBuildingForm = this.createCompanyBuildingForm();
        this.addressForm =  this.companyBuildingForm.get('address') as FormGroup;
        this.cAddressForm =  this.companyBuildingForm.get('cAddress') as FormGroup;
        this.adminForm = this.companyBuildingForm.get('admin') as FormGroup;
        this.loadClient();
    }

    createCompanyBuildingForm(): FormGroup {
        this.selectedCity = this.companyBuilding.address ? this.companyBuilding.address.city : {};
        this.selectedCorporateCity = this.companyBuilding.cAddress ? this.companyBuilding.cAddress.city : {};
        return this.companyBuildingForm = this._formBuilder.group({
            id                    : [this.companyBuilding.id],
            ownerId               : [this.companyBuilding.ownerId],
            alias                 : [this.companyBuilding.alias],
            name                  : [this.companyBuilding.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.companyBuilding.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.companyBuilding.address ? this.companyBuilding.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.companyBuilding.cAddress ? this.companyBuilding.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.companyBuilding.admin ? this.companyBuilding.admin : {}),
            emailNotification     : [this.companyBuilding.emailNotification, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            logo                  : [this.companyBuilding.logo],
            productCount          : [this.companyBuilding.productCount],
            sameAddress           : [this.companyBuilding.sameAddress],

        });
    }

    updateCompanyBuilding() {
        this.companyBuilding = this.companyBuildingForm.value;
        $('body').addClass('loading');
        this.companyBuilding.address.city = this.selectedCity;
        this.companyBuilding.cAddress.city = this.selectedCorporateCity;
        delete this.companyBuilding.cAddress.region;
        delete this.companyBuilding.address.region;
        delete this.companyBuilding.address.country;
        delete this.companyBuilding.cAddress.country;
        this.companyBuildingService.updateCompanyBuilding(this.companyBuilding)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.adminService.assignResponseError(data);
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyBuildingNickName);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            }
            this.loading = false;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            //if (data.error.errorField == COMPANY_BUILDING_CONSTANTS.FIELD.NAME) {
                this.companyBuildingForm.get('name').setErrors({'duplicate': true});
            //}
        }
    }

    loadCities() {
        this.loading = true;
        this.companyBuildingService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            $('#buildingCitySelect').show();
            this.loading = false;

        },
        error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
                this.loading = false;
           }
        );
    }

    loadCompanyBuilding(alias) {
        this.companyBuildingService.getCompanyBuilding(alias)
        .subscribe(
        data => {
            this.companyBuilding = data['data'][0];
            this.companyBuildingForm = this.createCompanyBuildingForm();
            this.addressForm =  this.companyBuildingForm.get('address') as FormGroup;
            this.cAddressForm =  this.companyBuildingForm.get('cAddress') as FormGroup;
            this.adminForm = this.companyBuildingForm.get('admin') as FormGroup;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
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
        $('#buildingCitySelect').hide();
    }

    searchCity(event) {
        let newValue = event.target.value;
        if (newValue && newValue.length >= 3) {
            this.query = newValue;
            this.loadCities();
        } else {
            this.query = '';
            $('#buildingCitySelect').hide();
        }
    }

    list() {
        this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
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
        this.companyBuildingService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#corporateCitySelect').show();
                this.loading = false;

            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
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

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyBuildingNickName + ' ' + 'List',COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST,true);
           this.breadCrumService.pushStep('Edit' + ' ' +  this.client.companyBuildingNickName, COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_EDIT, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }

    selectCorporateAddress(){
        this.isSameAddress = this.companyBuildingForm.get('sameAddress').value;
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
