import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CONSUMER_TICKET_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';
import { ConsumerTicketService} from '../../services/consumer-ticket.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    consumerTicket: any= {};
    files: any= [];
    services: any= [];
    consumerTicketForm: FormGroup;
    CONSUMER_TICKET_CONSTANTS= CONSUMER_TICKET_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_IMAGE,
        pageTitle: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_SHOW,
        pageDesc: CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_SHOW_DESC
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
                private consumerTicketService: ConsumerTicketService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CONSUMER_TICKET_CONSTANTS = CONSUMER_TICKET_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET);
        this.route.params.subscribe(
        params => {
            this.alias = params.alias;
            this.loadConsumerTicket();
        });
    }

    ngOnInit() {
        this.consumerTicketForm = this.createConsumerTicketForm();
    }

    createConsumerTicketForm(): FormGroup {
        return this.consumerTicketForm = this._formBuilder.group({
            id                  : [this.consumerTicket.id],
            subject             : [this.consumerTicket.subject],
            ticketId            : [this.consumerTicket.ticketId],
            description         : [this.consumerTicket.description],
        });
    }

    loadConsumerTicket() {
        $('body').addClass('loading');
        this.consumerTicketService.getConsumerTicket(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerTicket = data['data'][0];
            this.consumerTicketForm = this.createConsumerTicketForm();
            this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_LIST_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_PRODUCT_CONSUMER_TICKET_LIST_ALIAS.replace(":alias",this.consumerTicket.consumerProduct.alias),true);
            this.breadCrumService.pushStep(CONSUMER_TICKET_CONSTANTS.LABEL.CONSUMER_TICKET_SHOW_LINK, CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_SHOW, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CONSUMER_TICKET_CONSTANTS.URL.CONSUMER_TICKET_ALL_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        $('body').addClass('loading');
        this.consumerTicketService.uploadImage(this.files, this.consumerTicket.id)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.consumerTicket = data['data'][0];
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

   markDeleted(consumerTicket) {
       this.sweetAlertService.deleteCheck(this, consumerTicket);
   }

   remove(consumerTicket) {
      consumerTicket.logo=null;
      this.consumerTicketService.deleteProfilePicture(consumerTicket)
      .subscribe(
      data => {
          if (!data['hasError']) {
              this.sweetAlertService.deleteConfirmation(this.setting.entity);
          }
      },
      error => {
          this.loading = false;
      });
   }
}
