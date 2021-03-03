import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMPANY_CONSTANTS } from '../../../company/constants';
import { COMPANY_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CompanyService } from '../../services/company.service';
import { CompanyProductService } from '../../services/company-product.service';
import { DateService } from '../../../shared/services/date.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    selector: 'edit-company-building-modal',
    moduleId: module.id.toString(),
    templateUrl: 'edit-company-building-modal.component.html'
})

export class EditCompanyBuildingModalComponent implements OnInit {
    companies: any= [];
    companyBuildingProductObj: any= {};
    company: any= {};
    dispatchedDate: any;
    companyBuildings: any= [];
    click=false;
    currentUser=undefined;
    client:any={};
    companyBuildingProductForm: FormGroup;
    selectedCompanyBuildingProduct:any={};
    @Input() companyBuildingProduct;
    @Output() submitEvent = new EventEmitter<number>();
    selectedCompanyBuilding: any = {name:''};
    loading = false;
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    COMPANY_VALIDATOR= COMPANY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: COMPANY_CONSTANTS.LABEL.COMPANY_BUILDING_PRODUCT,
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    alias:any;
    totalPages= 0;
    buttonName= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_CREATE;
    buttonName1= COMPANY_CONSTANTS.LABEL.COMPANY_ACTION_EDIT;
    backUrl= COMPANY_CONSTANTS.URL.COMPANY_LIST;
    constructor(
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private dateService: DateService,
                private sweetAlertService: SweetAlertService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private companyProductService: CompanyProductService,
                private companyService: CompanyService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
          this.COMPANY_VALIDATOR = COMPANY_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
          this.currentPage = 1;
          this.pageSize = this.APP_CONFIG.PAGE_SIZE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.COMPANY_CONSTANTS.LABEL.COMPANY);
          this.authenticationService.sessionChange$.subscribe(
              () => {
                  this.currentUser = authenticationService.getCurrentUser();
              }
          );
    }

    ngOnInit() {
        var self = this;
        this.companyBuildingProductForm = this.createCompanyBuildingProductForm();
        $('#editCompanyBuildingModal').on('hidden.bs.modal', function(){
            self.companyBuildingProductForm = self.createCompanyBuildingProductForm();
            self.loadCompanyBuildings();
        });
        this.loadClient();
    }

    createCompanyBuildingProductForm(): FormGroup {
        this.selectedCompanyBuilding = this.companyBuildingProduct.companyBuilding ? this.companyBuildingProduct.companyBuilding : {};
        return this.companyBuildingProductForm = this._formBuilder.group({
            companyBuilding             : [this.companyBuildingProduct.companyBuilding ? this.selectedCompanyBuilding.name : ''],
            dispatchedDate              : [this.companyBuildingProduct.dispatchedDate],
            section                     : [this.companyBuildingProduct.section, [Validators.required, Validators.pattern('^[0-9]*$')]],
            floor                       : [this.companyBuildingProduct.floor, [Validators.required, Validators.pattern('^[0-9]*$')]]

        });
    }

    createCompanyBuildingProduct(form) {
        var companyBuildingProductObj = this.companyBuildingProductForm.value;
        $('body').addClass('loading');
        this.companyBuildingProduct=this.companyBuildingProduct;
        this.companyBuildingProduct.companyBuilding=this.selectedCompanyBuilding;
        this.companyBuildingProduct.floor=companyBuildingProductObj.floor;
        this.companyBuildingProduct.section=companyBuildingProductObj.section;
        this.companyBuildingProduct.dispatchedDate = this.dateService.getLongFromString(this.companyBuildingProduct.dispatchedDate);
        this.companyProductService.saveCompanyBuildingProduct(this.companyBuildingProduct)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.company = data['data'];
            } else {
                this.sweetAlertService.updateConfirmation(this.client.companyBuildingNickName+ ' ' + this.client.productNickName);
                this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
                form.resetForm();
                $('#editCompanyBuildingModal').modal('hide');
                this.submitEvent.emit(1);

            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([COMPANY_CONSTANTS.URL.COMPANY_ASSIGNED_COMPANY_BUILDING_PRODUCT]);
            form.resetForm();
            $('#editCompanyBuildingModal').modal('hide');
            this.loading = false;
        });
    }

    loadCompanyBuildings() {
        var _self = this;
        this.loading = true;
        this.companyProductService.getAllCompanyBuildings()
        .subscribe(
        data => {
            this.companyBuildings = data['data'][0];
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    clickCompanyBuilding(form){
        this.click = !this.click;
        this.createCompanyBuildingProduct(form);
        $('#editCompanyBuildingModal').modal('hide');
    }

    loadClient() {
        this.companyService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
        },
        () => {
           this.loading = false;
        });
    }

}
