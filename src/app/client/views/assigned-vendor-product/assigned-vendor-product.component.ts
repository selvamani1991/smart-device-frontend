import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ClientProductService } from '../../services/client-product.service';
import { ClientService } from '../../services/client.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ERROR_CODE } from '../../../constants';

@Component({
    selector: 'assigned-vendor-product.component',
    moduleId: module.id.toString(),
    templateUrl: 'assigned-vendor-product.component.html'
})

export class AssignedVendorProductComponent implements OnInit {
    vendorProducts: any = [];
    currentUser=undefined;
    client: any= {};
    dispatchedDate: any= {};
    dispatchDate: any;
    selectedProduct= {};
    services= [];
    loading = false;
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CLIENT_CONSTANTS.LABEL.ASSIGNED_VENDOR_PRODUCT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_VENDOR_PRODUCT,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_VENDOR_PRODUCT_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private authenticationService: AuthenticationService,
                private clientProductService: ClientProductService,
                private clientService: ClientService,
                private alertService: AlertService,
                private dateService: DateService,
                private breadCrumService: BreadCrumService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.authenticationService.sessionChange$.subscribe(
             () => {
                 this.currentUser = authenticationService.getCurrentUser();

             }
        );
    }

    ngOnInit() {
        this.loadAssignedVendorProducts();
        this.loadClient();
        $('#dispatchDate').datepicker({
             changeMonth: true,
             changeYear: true,
             dateFormat: 'dd/mm/yy',
             onSelect: (selectedDate) => {
                 this.dispatchDate = selectedDate;
            }
        });
    }

    loadAssignedVendorProducts() {
        this.loading = true;
        $('body').addClass('loading');
        this.clientProductService.getAllAssignedVendorProducts(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.vendorProducts = data['data'];
            this.paginationItems = this.vendorProducts;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
            for (var i = 0; i < this.vendorProducts.length; i++){
                if (this.vendorProducts[i].dispatchedDate && this.vendorProducts[i].dispatchedDate > 0 ){
                    this.vendorProducts[i].dispatchedDate = this.dateService.getDateString(this.vendorProducts[i].dispatchedDate);
                }else{
                    this.vendorProducts[i].dispatchedDate = 'N/A';
                }
            }
        },
        error => {
            $('body').removeClass('loading');
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    dispatchProduct(vendorProduct) {
        this.selectedProduct = vendorProduct.product;
    }

    changePage(event) {
       this.currentPage = event;
       this.loadAssignedVendorProducts();
    }

    changePageSize(event) {
       this.pageSize = event;
       this.loadAssignedVendorProducts();
    }

    reloadRoles() {
        this.loadAssignedVendorProducts();
    }

    searchAssignedVendorProduct(newValue) {
        var myModel = newValue;
        if (myModel.length > 1){
            this.query = myModel;
            this.currentPage=1;
            this.loadAssignedVendorProducts();
        }else {
            this.query = '';
            this.loadAssignedVendorProducts();
        }
    }

    loadClient() {
        this.clientService.getClients(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Assigned' + ' ' + this.client.vendorNickName + ' ' + this.client.productNickName, CLIENT_CONSTANTS.URL.CLIENT_ASSIGNED_VENDOR_PRODUCT, true);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
