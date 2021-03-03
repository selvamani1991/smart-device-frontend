import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CLIENT_VALIDATOR } from '../../validator';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ClientService} from '../../services/client.service';
import { ClientProductService } from '../../services/client-product.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { SubscriptionService } from '../../../subscription/services/subscription.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { TooltipService } from '../../../shared/services/tooltip.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    client: any= {};
    subscriptions: any= [];
    clients: any= [];
    services: any= [];
    cities: any= [];
    files: any= [];
    formatError= false;
    clientForm: FormGroup;
    addressForm: FormGroup;
    adminForm: FormGroup;
    cAddressForm: FormGroup;
    selectedSubscription= {name: 0}
    selectedCity: any= {id: 0, region: '', name: '', country: ''};
    selectedCorporateCity: any= {id: 0, region: '', name: '', country: ''};
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    CLIENT_VALIDATOR= CLIENT_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT_IMAGES,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_SHOW,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_SHOW_DESC
    };
    alias: any;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query: '';
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private clientService: ClientService,
                private adminService: AdminService,
                private addressService: AddressService,
                private clientProductService: ClientProductService,
                private subscriptionService: SubscriptionService,
                private httpResponseService: HttpResponseService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.CLIENT_VALIDATOR = CLIENT_VALIDATOR;
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_LIST_LINK, CLIENT_CONSTANTS.URL.CLIENT_LIST, true);
        breadCrumService.pushStep(CLIENT_CONSTANTS.LABEL.CLIENT_SHOW_LINK, CLIENT_CONSTANTS.URL.CLIENT_SHOW, false);
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
            name                    : [this.client.name, [Validators.required, Validators.pattern(/^[^*|\":<>[\]{}`\\()';@&$*^#%?~``=/[+]+$/)]],
            description             : [this.client.description, [Validators.required, Validators.minLength(3)]],
            address                 :  this.addressService.getAddressForm(this._formBuilder, this.client.address ? this.client.address : {}),
            cAddress                : this.addressService.getAddressForm(this._formBuilder, this.client.cAddress ? this.client.cAddress : {}),
            admin                   :  this.adminService.getAdminEditForm(this._formBuilder, this.client.admin ? this.client.admin : {}),
            productNickName         : [this.client.productNickName],
            productTypeNickName     : [this.client.productTypeNickName],
            vendorNickName          : [this.client.vendorNickName],
            paymentGatewayAPIKey    : [this.client.paymentGatewayAPIKey],
            paymentSecretKey        : [this.client.paymentSecretKey],
            distributorNickName     : [this.client.distributorNickName],
            companyNickName         : [this.client.companyNickName],
            companyBuildingNickName : [this.client.companyBuildingNickName],
            distributorSupported    : [this.client.distributorSupported],
            emailNotification       : [this.client.emailNotification],

        });
    }

    loadClient(alias) {
         $('body').addClass('loading');
        this.clientService.getClient(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.client = data['data'][0];
            this.clientForm = this.createClientForm();
            this.addressForm =  this.clientForm.get('address') as FormGroup;
            this.cAddressForm =  this.clientForm.get('cAddress') as FormGroup;
            this.adminForm = this.clientForm.get('admin') as FormGroup;
            this.tooltipService.clear();

        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
        });
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

    processFile() {
        this.clientProductService.uploadImage(this.files, this.client.id)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity)
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

    loadSubscription() {
        this.subscriptionService.getSubscriptions(this.alias)
        .subscribe(
            data => {
            this.subscriptions = data['data'];
        },
        () => {
            this.loading = false;
        } );
    }

    markDeleted(client) {
        this.sweetAlertService.deleteCheck(this, client);
    }

    remove(client) {
        client.logo=null;
        this.clientService.deleteProfilePicture(client)
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
}
