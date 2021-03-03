import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ADDRESS_VALIDATOR } from '../../../shared/validator';
import { ADMIN_VALIDATOR } from '../../../shared/validator';
import { COMPANY_BUILDING_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { CompanyBuildingService} from '../../services/company-building.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    companyBuilding: any= {};
    companyBuildings: any= [];
    formatError= false;
    client: any= {};
    currentUser=undefined;
    files: any= [];
    services: any= [];
    cities: any= [];
    companyBuildingForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    selectedCity= {id: 0, state: '', name: '', country: ''};
    selectedCorporateCity= {id: 0, state: '', name: '', country: ''};
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    ADDRESS_VALIDATOR= ADDRESS_VALIDATOR;
    ADMIN_VALIDATOR= ADMIN_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
    entity: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_IMAGE,
    pageTitle: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_SHOW,
    pageDesc: COMPANY_BUILDING_CONSTANTS.LABEL.COMPANY_BUILDING_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private adminService: AdminService,
                private addressService: AddressService,
                private companyBuildingService: CompanyBuildingService,
                private httpResponseService: HttpResponseService,
                private _formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.COMPANY_BUILDING_CONSTANTS = COMPANY_BUILDING_CONSTANTS;
        this.ADDRESS_VALIDATOR = ADDRESS_VALIDATOR;
        this.ADMIN_VALIDATOR = ADMIN_VALIDATOR;
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
        return this.companyBuildingForm = this._formBuilder.group({
            id                    : [this.companyBuilding.id],
            name                  : [this.companyBuilding.name],
            description           : [this.companyBuilding.description],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.companyBuilding.address ? this.companyBuilding.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.companyBuilding.cAddress ? this.companyBuilding.cAddress : {}),
            admin                 :  this.adminService.getAdminForm(this._formBuilder, this.companyBuilding.admin ? this.companyBuilding.admin : {}),
            emailNotification     : [this.companyBuilding.emailNotification]
        });
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

    loadCompanyBuilding(alias) {
        $('body').addClass('loading');
        this.companyBuildingService.getCompanyBuilding(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.companyBuilding = data['data'][0];
            this.companyBuildingForm = this.createCompanyBuildingForm();
            this.addressForm =  this.companyBuildingForm.get('address') as FormGroup;
            this.cAddressForm =  this.companyBuildingForm.get('cAddress') as FormGroup;
            this.adminForm = this.companyBuildingForm.get('admin') as FormGroup;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST]);
            this.loading = false;
        });

    }

    processFile() {
        this.companyBuildingService.uploadImage(this.files, this.companyBuilding.id)
        .subscribe(
        data => {
            this.companyBuilding = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            this.assignResponseError(error);
        });
    }

    assignResponseError(error){
        if (error.error.error.errorCode == ERROR_CODE.code_25) {
              this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
        }

    }

    onFileChange(event) {
         this.files = event.target.files[0];
         let pattern = /image-*/;
         if (!this.files.type.match(pattern)) {
             this.formatError = true;
             return;
         } else {
             this.formatError = false;
         }
         this.processFile();
    }

    markDeleted(companyBuilding) {
       this.sweetAlertService.deleteCheck(this, companyBuilding);
    }

    remove(companyBuilding) {
        companyBuilding.logo=null;
        this.companyBuildingService.deleteProfilePicture(companyBuilding)
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.sweetAlertService.deleteImage(this.setting.entity);
            }
        },
        error => {
            this.loading = false;
        });
    }

    loadClient() {
        this.companyBuildingService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyBuildingNickName + ' ' + 'List',COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_LIST,true);
           this.breadCrumService.pushStep('Show' + ' ' +   this.client.companyBuildingNickName, COMPANY_BUILDING_CONSTANTS.URL.COMPANY_BUILDING_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}

