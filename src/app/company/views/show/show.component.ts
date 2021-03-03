import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { COMPANY_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { CompanyService} from '../../services/company.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    company: any= {};
    client: any= {};
    files: any= [];
    services: any= [];
    currentUser=undefined;
    cities: any= [];
    zones: any= [];
    selectedZone= {alias: ''};
    companyForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    selectedCity= {id: 0, state: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_IMAGE,
        pageTitle: COMPANY_CONSTANTS.LABEL.COMPANY_SHOW,
        pageDesc: COMPANY_CONSTANTS.LABEL.COMPANY_SHOW_DESC
    };
    alias: any;
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private companyService: CompanyService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
        /*breadCrumService.pushStep(COMPANY_CONSTANTS.LABEL.COMPANY_LIST_LINK, COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
        breadCrumService.pushStep(COMPANY_CONSTANTS.LABEL.COMPANY_SHOW_LINK, COMPANY_CONSTANTS.URL.COMPANY_SHOW, false);
        this.steps = breadCrumService.getSteps();*/
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;
            this.loadCompany(this.alias);
        });
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
    }

    createCompanyForm(): FormGroup {
        this.selectedCity = this.company.address ? this.company.address.city : {};
        this.selectedCorporateCity = this.company.cAddress ? this.company.cAddress.city : {};
        this.selectedZone = this.company.zoneId ? this.company.zoneId : {};
        return this.companyForm = this._formBuilder.group({
            id                    : [this.company.id],
            ownerId               : [this.company.ownerId],
            alias                 : [this.company.alias],
            name                  : [this.company.name, [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+$/)]],
            description           : [this.company.description, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.company.address ? this.company.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.company.cAddress ? this.company.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.company.admin ? this.company.admin : {}),
            zoneId                : [this.company.zoneId ? this.selectedZone : '', [Validators.required]],
            emailNotification     : [this.company.emailNotification, [Validators.required, Validators.minLength(3)]]

        });
    }

    loadCities() {
        this.loading = true;
        this.companyService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                $('#citySelect').show();
                this.loading = false;
            },
            error => {
                this.sweetAlertService.notSuccessful(error.errorMessageCode);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_LIST]);
                this.loading = false;
            }
        );
    }

    loadZones() {
        this.companyService.getZones()
        .subscribe(
        data => {
            if (!data['hasError']) {
                this.zones = data['data'];
            }
            this.loading = false;
        },
        () => {
            this.loading = false;
        });
    }

    loadCompany(alias) {
         $('body').addClass('loading');
        this.companyService.getCompany(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.company = data['data'][0];
            this.companyForm = this.createCompanyForm();
            this.addressForm =  this.companyForm.get('address') as FormGroup;
            this.cAddressForm =  this.companyForm.get('cAddress') as FormGroup;
            this.adminForm = this.companyForm.get('admin') as FormGroup;

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
        });
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

    processFile() {
        this.companyService.uploadImage(this.files, this.company.id)
        .subscribe(
        data => {
            if(data['hasError']){
                this.assignResponseError(data);
            }else{
                this.company = data['data'][0];
                this.sweetAlertService.uploadSuccessfully(this.setting.entity);
            }
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
        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        }else {
            this.formatError = false;
        }
        this.processFile();
    }

    markDeleted(company) {
       this.sweetAlertService.deleteCheck(this, company);
    }

    remove(company) {
        company.logo=null;
        this.companyService.deleteProfilePicture(company)
        .subscribe(
        data => {
            if(data['hasError']){
            }else{
                this.sweetAlertService.deleteImage(this.setting.entity);
            }
        },
        error => {
            this.loading = false;
        });
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.companyNickName + ' ' + 'List', COMPANY_CONSTANTS.URL.COMPANY_LIST, true);
           this.breadCrumService.pushStep('Show' + ' ' +  this.client.companyNickName, COMPANY_CONSTANTS.URL.COMPANY_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
