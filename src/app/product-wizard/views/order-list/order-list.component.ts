import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup,Validators,FormControl,FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PRODUCT_WIZARD_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { PRODUCT_WIZARD_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { ProductWizardService } from '../../services/product-wizard.service';
import { NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

declare var $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'order-list.component.html'
})

export class OrderListComponent implements OnInit {
    loading = false;
    submitted = false;
    alias:any={};
    orderWizard:any={};
    query= '';
    orderWizards:any=[];
    productWizard:any={};
    currentUser=undefined;
    client={};
    productForm:FormGroup;
    productAssignmentForm:FormGroup;
    PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS=PRODUCT_TYPE_CONSTANTS;
    PRODUCT_WIZARD_VALIDATOR=PRODUCT_WIZARD_VALIDATOR;
    APP_CONFIG=APP_CONFIG;
    ERROR_CODE=ERROR_CODE;
    paginationItems=[];
    itemSize=0;
    setting = {
        entity: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_ASSIGNMENT,
        pageTitle: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE,
        pageDesc: PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_CREATE_DESC
    };
    steps=[];
    totalSize=0;
    currentPage=0;
    pageSize=8;
    totalPages=0;
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private productWizardService: ProductWizardService,
                private alertService: AlertService,
                private dateService: DateService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private tooltipService: TooltipService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG=APP_CONFIG;
        this.PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS=PRODUCT_TYPE_CONSTANTS;
        this.PRODUCT_WIZARD_VALIDATOR=PRODUCT_WIZARD_VALIDATOR;
        this.ERROR_CODE=ERROR_CODE;
        this.pageSize=this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD_ORDER_LIST_LINK, PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, true);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME+ " :: "+ this.PRODUCT_WIZARD_CONSTANTS.LABEL.PRODUCT_WIZARD);
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadOrder();
        this.loadClient();
    }

    loadOrder() {
        this.loading = true;
         $('body').addClass('loading');
        this.productWizardService.getAllOrderWizard(this.currentPage, this.pageSize,this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.orderWizards = data['data'];
            this.paginationItems = this.orderWizards;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            this.tooltipService.enable();
            for (let i = 0; i < this.orderWizards.length; i++) {
                if (this.orderWizards[i].manufacturerDate && this.orderWizards[i].manufacturerDate > 0 ) {
                    this.orderWizards[i].manufacturerDate = this.dateService.getDateString(this.orderWizards[i].manufacturerDate);
                }else {
                    this.orderWizards[i].manufacturerDate = 'N/A';
                }

            }
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.errorMessageCode);
            this.loading = false;
        });
    }

    searchOrder(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadOrder();
        }else {
            this.query = '';
            this.loadOrder();
        }
    }

    changePage(event) {
        this.currentPage = event;
        this.loadOrder();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadOrder();
    }

    addOrder(){
        this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_CREATE]);
    }

    invoice(orderWizard) {
        this.tooltipService.clear();
        this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_INVOICE_SHOW, orderWizard.invoiceId]);
    }

    editProductOrder(orderWizard) {
        this.tooltipService.clear();
        if(orderWizard.installation == 'preInstallation'){
            this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_CREATE_PRODUCT, orderWizard.alias]);
        }else{
           this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_PRODUCT_ORDER_CREATE, orderWizard.alias]);

        }

    }

    changeStatus(orderWizard, status) {
        orderWizard.active = status;
        this.productWizardService.updateOrderWizard(orderWizard)
        .subscribe(
        data => {
            if (data['hasError']) {
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, this.orderWizard.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_WIZARD_CONSTANTS.URL.PRODUCT_WIZARD_ORDER_LIST, this.orderWizard.alias]);
            this.loading = false;
        });
    }

    loadClient() {
        this.productWizardService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
        },
        () => {
           this.loading = false;
        });
    }
}