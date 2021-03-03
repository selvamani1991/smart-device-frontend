import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { AUTH_CONSTANTS } from '../../constants';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'subscription.component.html'
})

export class SubscriptionComponent {
    registerUser: any = {};
    emailAlreadyRegistered = false;
    loading = false;
    subscription: any = {};
    subscriptions: any = [];
    APP_CONFIG = APP_CONFIG;
    AUTH_CONSTANTS = AUTH_CONSTANTS;
    paginationItems = [];
    itemSize = 0;
    setting = {
        pageTitle: AUTH_CONSTANTS.LABEL.REGISTER_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.REGISTER_DESC
    };
    steps = [];
    totalSize = 0;
    currentPage = 0;
    pageSize = 8;
    totalPages = 0;
    query = '';
    constructor(
        private router: Router,
        private titleService: Title,
        private authenticationService: AuthenticationService,
        private httpResponseService: HttpResponseService,
        private translate: TranslateService,
        private alertService: AlertService
        ) {
        this.APP_CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.translate.instant(this.AUTH_CONSTANTS.LABEL.REGISTER_LINK));

    }
    ngOnInit() {
       // this.loadSubscription();
    }

  /* loadSubscription() {
        this.loading = true;
        this.authenticationService.getAllSubscriptions(this.currentPage,this.pageSize,this.query)
        .subscribe(
            data => {
                this.subscriptions = data["data"];
                this.paginationItems=this.subscriptions;
                this.itemSize=this.paginationItems.length;
                this.currentPage=data['page'];
                this.pageSize=data['pageSize'];
                this.totalSize=data['count'];
                var reminder=this.totalSize % this.pageSize;
                this.totalPages = reminder == 0 ? Math.floor(this.totalSize/ this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
            },
            failure => {
                   this.httpResponseService.showErrorResponse(failure);
                   this.router.navigate([AUTH_CONSTANTS.URL.SUBSCRIPTION_LIST]);
                   this.loading = false;
           }
        );
   }*/

}















/*import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SUBSCRIPTION_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { SubscriptionService } from '../../services/subscription.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    subscriptions: any = [];
    users=[];
    form:any={};
    subscription:any={};
    subscriptionDetails: any=[];
    services=[];
    loading = false;
    SUBSCRIPTION_CONSTANTS=SUBSCRIPTION_CONSTANTS;
    APP_CONFIG=APP_CONFIG;
    SUCCESS_CODE=SUCCESS_CODE;
    paginationItems=[];
    itemSize=0;
    ERROR_CODE=ERROR_CODE;
    setting = {
        entity: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION,
        pageTitle: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST,
        pageDesc: SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_DESC
    };
    steps=[];
    totalSize=0;
    currentPage=0;
    pageSize=8;
    totalPages=0;
    query='';
    constructor(
    private router: Router,
    private subscriptionService: SubscriptionService,
    private alertService: AlertService,
    private dateService: DateService,
    private breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private httpResponseService: HttpResponseService,
    private titleService: Title) {
        this.APP_CONFIG=APP_CONFIG;
        this.APP_CONFIG=APP_CONFIG;
        this.SUCCESS_CODE=SUCCESS_CODE;
        this.SUBSCRIPTION_CONSTANTS=SUBSCRIPTION_CONSTANTS;
        this.currentPage=1;
        this.pageSize=this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_LIST_LINK,SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST,true);
        //breadCrumService.pushStep(SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION_CREATE_LINK,SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_CREATE,false);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME+ " :: "+ this.SUBSCRIPTION_CONSTANTS.LABEL.SUBSCRIPTION);
    }

   ngOnInit() {
       this.loadSubscription();
   }

   loadSubscription() {
        this.loading = true;
        this.subscriptionService.getAllSubscriptions(this.currentPage,this.pageSize,this.query)
        .subscribe(
            data => {
                this.subscriptions = data["data"];
                this.paginationItems=this.subscriptions;
                this.itemSize=this.paginationItems.length;
                this.currentPage=data['page'];
                this.pageSize=data['pageSize'];
                this.totalSize=data['count'];
                var reminder=this.totalSize % this.pageSize;
                this.totalPages = reminder == 0 ? Math.floor(this.totalSize/ this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
            },
            failure => {
                   this.httpResponseService.showErrorResponse(failure);
                   this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
                   this.loading = false;
           }
        );
   }

   changePage(event){
        this.currentPage=event;
        this.loadSubscription();
   }

   changePageSize(event){
        this.pageSize=event;
        this.loadSubscription();
   }

   addSubscription(){
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_CREATE]);
   }

   edit(subscription){
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_EDIT,subscription.alias]);
   }

   show(subscription){
        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_SHOW,subscription.alias]);
   }

   markDeleted(subscription) {
        this.sweetAlertService.deleteCheck(this,subscription);
   }


    remove(subscription) {
        this.subscriptionService.deleteSubscription(subscription.alias)
            .subscribe(
                data => {
                    if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                        subscription.isDeleted=true;
                        subscription.isActive=false;
                        this.sweetAlertService.deleteConfirmation(this.setting.entity);
                        this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
                        this.loadSubscription();
                    }
                    else{
                        this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                    }
                },
                error => {
                    console.log(error);
                    this.alertService.error(error.message);
                    this.loading = false;
                });
    }

  changeStatus(subscription,status){
        subscription.active=status;
        this.subscriptionService.updateSubscription(subscription)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data,this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([SUBSCRIPTION_CONSTANTS.URL.SUBSCRIPTION_LIST]);
            this.loading = false;
        });
  }

  assignResponseError(data,form){
        if(data.error.errorCode == ERROR_CODE.code_14){
            if(data.error.errorField == SUBSCRIPTION_CONSTANTS.FIELD.NAME){
                form.form.controls[SUBSCRIPTION_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
  }

  searchSubscription(newValue) {
       var myModel = newValue;
       if(myModel.length>1){
           this.query=myModel;
           this.loadSubscription();
       }
       else{
           this.query='';
           this.loadSubscription();
       }
  }
}*/
