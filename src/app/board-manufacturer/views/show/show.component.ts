import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { BoardManufacturerService} from '../../services/board-manufacturer.service';
import { AdminService } from '../../../shared/services/admin.service';
import { AddressService } from '../../../shared/services/address.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    boardManufacturer: any= {};
    services: any= [];
    cities: any= [];
    boardManufacturerForm: FormGroup;
    addressForm: FormGroup;
    cAddressForm: FormGroup;
    adminForm: FormGroup;
    selectedCity: any= {id: 0, region: '', country: '' , name: ''};
    selectedCorporateCity: any= {id: 0, region: '', country: '' , name: ''};
    totalSize= 0;
    currentPage= 1;
    pageSize= 8;
    totalPages= 0;
    query= '';
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_IMAGE,
        pageTitle: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_SHOW,
        pageDesc: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_SHOW_DESC
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
                private boardManufacturerService: BoardManufacturerService,
                private adminService: AdminService,
                private addressService: AddressService,
                private _formBuilder: FormBuilder,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_LIST_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST, true);
        breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_SHOW_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadBoardManufacturer(this.alias);
            }
        );
    }

    ngOnInit() {
        this.boardManufacturerForm = this.createBoardManufacturerForm();
        this.addressForm =  this.boardManufacturerForm.get('address') as FormGroup;
        this.cAddressForm =  this.boardManufacturerForm.get('cAddress') as FormGroup;
        this.adminForm = this.boardManufacturerForm.get('admin') as FormGroup;
    }

    createBoardManufacturerForm(): FormGroup {
        this.selectedCity = this.boardManufacturer.address ? this.boardManufacturer.address.city : {};
        this.selectedCorporateCity = this.boardManufacturer.cAddress ? this.boardManufacturer.cAddress.city : {};
        return this.boardManufacturerForm = this._formBuilder.group({
            id                    : [this.boardManufacturer.id],
            ownerId               : [this.boardManufacturer.ownerId],
            alias                 : [this.boardManufacturer.alias],
            name                  : [this.boardManufacturer.name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
            description           : [this.boardManufacturer.description, [Validators.required, Validators.minLength(3)]],
            address               :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.address ? this.boardManufacturer.address : {}),
            cAddress              :  this.addressService.getAddressForm(this._formBuilder, this.boardManufacturer.cAddress ? this.boardManufacturer.cAddress : {}),
            admin                 :  this.adminService.getAdminEditForm(this._formBuilder, this.boardManufacturer.admin ? this.boardManufacturer.admin : {})
        });
    }

    loadCities() {
        this.boardManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
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

    loadBoardManufacturer(alias) {
        $('body').addClass('loading');
        this.boardManufacturerService.getBoardManufacturer(alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.boardManufacturer = data['data'][0];
            this.boardManufacturerForm = this.createBoardManufacturerForm();
            this.addressForm =  this.boardManufacturerForm.get('address') as FormGroup;
            this.cAddressForm =  this.boardManufacturerForm.get('cAddress') as FormGroup;
            this.adminForm = this.boardManufacturerForm.get('admin') as FormGroup;
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });

    }

    loadCorporateCities() {
        this.boardManufacturerService.getCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];

        },
        () => {
                this.loading = false;
           }
        );
    }

    processFile() {
        this.boardManufacturerService.uploadImage(this.files, this.boardManufacturer.id)
        .subscribe(
        data => {
            this.boardManufacturer = data['data'][0];
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
        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }

    markDeleted(boardManufacturer) {
        this.sweetAlertService.deleteCheck(this, boardManufacturer);
    }

    remove(boardManufacturer) {
        boardManufacturer.logo=null;
        this.boardManufacturerService.deleteProfilePicture(boardManufacturer)
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
