import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { MACHINE_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { MachineService} from '../../services/machine.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    currentUser= undefined;
    machine: any= {};
    files: any= [];
    services: any= [];
    manufacturerDate: any;
    machineForm: FormGroup;
    MACHINE_CONSTANTS= MACHINE_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: MACHINE_CONSTANTS.LABEL.MACHINE_IMAGE,
        pageTitle: MACHINE_CONSTANTS.LABEL.MACHINE_SHOW,
        pageDesc: MACHINE_CONSTANTS.LABEL.MACHINE_SHOW_DESC
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
                private machineService: MachineService,
                private authenticationService: AuthenticationService,
                private dateService: DateService,
                private alertService: AlertService,
                private _formBuilder: FormBuilder,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.MACHINE_CONSTANTS = MACHINE_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MACHINE_CONSTANTS.LABEL.MACHINE);
        this.route.params.subscribe(
            params => {
                this.alias = params.alias;
                this.loadMachine();
            }
        );
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.machineForm = this.createMachineForm();
    }

    createMachineForm(): FormGroup {
        var manufacturerDate = this.dateService.getDateString(this.machine.manufacturerDate);
        return this.machineForm = this._formBuilder.group({
            id               : [this.machine.id],
            name             : [this.machine.name, []],
            description      : [this.machine.description],
            machineId        : [this.machine.machineId],
            manufacturerDate : [manufacturerDate]
        });
    }

    loadMachine() {
        $('body').addClass('loading');
        this.machineService.getMachine(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.machine = data['data'][0];
            this.machineForm = this.createMachineForm();
            if (this.currentUser && this.currentUser.userType == 'clientAdmin') {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_LINK, PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MACHINES_ALIAS.replace(":alias",this.machine.machineProductTypeId),true);
            }else {
                this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_MACHINE_LIST_LINK, MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST_ALIAS.replace(":alias",this.machine.machineProductTypeId),true);
            }
            this.breadCrumService.pushStep(MACHINE_CONSTANTS.LABEL.MACHINE_SHOW_LINK, MACHINE_CONSTANTS.URL.MACHINE_EDIT, false);
            this.steps = this.breadCrumService.getSteps();
        },
        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST]);
            this.loading = false;
        });

    }

    processFile() {
        this.machineService.uploadImage(this.files, this.machine.id)
        .subscribe(
        data => {
            this.machine = data['data'][0];
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

   markDeleted(machine) {
       this.sweetAlertService.deleteCheck(this, machine);
   }

   remove() {
       this.machine.logo=null;
       this.machineService.deleteProfilePicture(this.machine)
       .subscribe(
       data => {
           if (!data['hasError']) {
                this.sweetAlertService.deleteImage(this.setting.entity);
                this.loadMachine();
           }
           else {
               this.sweetAlertService.notSuccessful(data['error'].errorMessage);
           }
       },
       failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.router.navigate([MACHINE_CONSTANTS.URL.MACHINE_MACHINE_LIST]);
           this.loading = false;
       });
   }
}
