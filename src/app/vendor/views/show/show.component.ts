import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { VENDOR_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { VendorService} from '../../services/vendor.service';
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
    vendor: any= {};
    client: any= {};
    currentUser=undefined;
    formatError= false;
    files: any= [];
    services: any= [];
    cities= [];
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    zone: any= {};
    zones: any= [];
    selectedZone= {alias: ''};
    vendorForm: FormGroup;
    currentPage= 1;
    pageSize= 8;
    query: '';
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
    entity: VENDOR_CONSTANTS.LABEL.VENDOR_IMAGE,
    pageTitle: VENDOR_CONSTANTS.LABEL.VENDOR_SHOW,
    pageDesc: VENDOR_CONSTANTS.LABEL.VENDOR_SHOW_DESC
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
                private vendorService: VendorService,
                private adminService: AdminService,
                private addressService: AddressService,
                private httpResponseService: HttpResponseService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.VENDOR_CONSTANTS.LABEL.VENDOR);
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
        this.loadZones();
        this.loadClient();

    }

    createVendorForm(): FormGroup {
        this.selectedCity = this.vendor.address ? this.vendor.address.city : {};
        this.selectedCorporateCity = this.vendor.cAddress ? this.vendor.cAddress.city : {};
        this.selectedZone = this.vendor.zoneId ? this.vendor.zoneId : {};
        return this.vendorForm = this._formBuilder.group({
            id                    : [this.vendor.id],
            ownerId               : [this.vendor.ownerId],
            alias                 : [this.vendor.alias],
            emailNotification     : [this.vendor.emailNotification, [Validators.required, Validators.minLength(3)]],
            name                  : [this.vendor.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description           : [this.vendor.description, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.vendor.address ? this.vendor.address : {}),
            cAddress               :  this.addressService.getAddressForm(this._formBuilder, this.vendor.cAddress ? this.vendor.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.vendor.admin ? this.vendor.admin : {}),
            zoneId                : [this.vendor.zoneId ? this.selectedZone : '', [Validators.required]],


        });
    }

    processFile() {
        $('body').addClass('loading');
        this.vendorService.uploadImage(this.files, this.vendor.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.vendor = data['data'][0];
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

        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        }else {
            this.formatError = false;
        }
        this.processFile();
    }

    loadCities() {
        this.vendorService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                this.cities = data['data'];
                this.loading = false;

            },() => {
                this.loading = false;
            }
        );
    }

    loadZones() {
        this.vendorService.getZones()
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

    loadVendor(alias) {
        $('body').addClass('loading');
        this.vendorService.getVendor(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.vendor = data['data'][0];
            this.vendorForm = this.createVendorForm();
            this.addressForm =  this.vendorForm.get('address') as FormGroup;
            this.cAddressForm =  this.vendorForm.get('cAddress') as FormGroup;
            this.adminForm = this.vendorForm.get('admin') as FormGroup;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([VENDOR_CONSTANTS.URL.VENDOR_LIST]);
            this.loading = false;
        });

    }

    loadCorporateCities() {
        this.vendorService.getCities(this.currentPage, this.pageSize, this.query)
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

    markDeleted(vendor) {
       this.sweetAlertService.deleteCheck(this, vendor);
    }

    remove(vendor) {
        vendor.logo=null;
        this.vendorService.deleteProfilePicture(vendor)
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
        this.vendorService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep(this.client.vendorNickName + ' ' +'List',VENDOR_CONSTANTS.URL.VENDOR_LIST,true);
           this.breadCrumService.pushStep('Show' + ' ' +  this.client.vendorNickName, VENDOR_CONSTANTS.URL.VENDOR_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
