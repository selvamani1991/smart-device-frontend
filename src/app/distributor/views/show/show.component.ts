import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DISTRIBUTOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { DistributorService} from '../../services/distributor.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    distributor: any= {};
    formatError= false;
    client: any= {};
    currentUser=undefined;
    files: any= [];
    services: any= [];
    cities= [];
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    distributorForm: FormGroup;
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    DISTRIBUTOR_CONSTANTS= DISTRIBUTOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_IMAGE,
        pageTitle: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SHOW,
        pageDesc: DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR_SHOW_DESC
    };

    alias: any;
    formValidation= {
        duplicateErrorDistributorName: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private distributorService: DistributorService,
                private authenticationService: AuthenticationService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.DISTRIBUTOR_CONSTANTS = DISTRIBUTOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.DISTRIBUTOR_CONSTANTS.LABEL.DISTRIBUTOR);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadDistributor(this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.distributorForm = this.createDistributorForm();
        this.addressForm =  this.distributorForm.get('address') as FormGroup;
        this.cAddressForm =  this.distributorForm.get('cAddress') as FormGroup;
        this.adminForm = this.distributorForm.get('admin') as FormGroup;
        this.loadClient();
    }

    createDistributorForm(): FormGroup {
        this.selectedCity = this.distributor.address ? this.distributor.address.city : {};
        this.selectedCorporateCity = this.distributor.cAddress ? this.distributor.cAddress.city : {};
        return this.distributorForm = this._formBuilder.group({
            id                    : [this.distributor.id],
            ownerId               : [this.distributor.ownerId],
            alias                 : [this.distributor.alias],
            name                  : [this.distributor.name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            emailNotification     : [this.distributor.emailNotification, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            description           : [this.distributor.description, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.distributor.address ? this.distributor.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.distributor.cAddress ? this.distributor.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.distributor.admin ? this.distributor.admin : {})
        });
    }

    loadCities() {
        this.distributorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            this.loading = false;
        },
        () => {
                this.loading = false;
           }
        );
    }

    loadCorporateCities() {
        this.distributorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            this.loading = false;

        },
        () => {
                this.loading = false;
           }
        );
    }

    loadDistributor(alias) {
         $('body').addClass('loading');
        this.distributorService.getDistributor(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributor = data['data'][0];
            this.distributorForm = this.createDistributorForm();
            this.addressForm =  this.distributorForm.get('address') as FormGroup;
            this.cAddressForm =  this.distributorForm.get('cAddress') as FormGroup;
            this.adminForm = this.distributorForm.get('admin') as FormGroup;

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST]);
            this.loading = false;
        });

    }

    processFile() {
        $('body').addClass('loading');
        this.distributorService.uploadImage(this.files, this.distributor.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.distributor = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            $('body').removeClass('loading');
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

    markDeleted(distributor) {
       this.sweetAlertService.deleteCheck(this, distributor);
    }

    remove(distributor) {
        distributor.logo=null;
        this.distributorService.deleteProfilePicture(distributor)
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
        this.distributorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.distributorNickName + ' ' + 'List', DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_LIST, true);
           this.breadCrumService.pushStep('Show' + ' ' +   this.client.distributorNickName, DISTRIBUTOR_CONSTANTS.URL.DISTRIBUTOR_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
