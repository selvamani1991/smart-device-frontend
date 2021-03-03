import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { ClientProductService} from '../../services/client-product.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ClientService } from '../../services/client.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'machine-productType-show.component.html'
})

export class MachineProductTypeShowComponent implements OnInit {
    loading = false;
    machineProductType: any= {};
    client: any= {};
    currentUser=undefined;
    services: any= [];
    CLIENT_CONSTANTS= CLIENT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: CLIENT_CONSTANTS.LABEL.CLIENT,
        pageTitle: CLIENT_CONSTANTS.LABEL.CLIENT_SHOW,
        pageDesc: CLIENT_CONSTANTS.LABEL.CLIENT_SHOW_DESC
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
                private clientProductService: ClientProductService,
                private breadCrumService: BreadCrumService,
                private clientService: ClientService,
                private sweetAlertService: SweetAlertService,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CLIENT_CONSTANTS = CLIENT_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CLIENT_CONSTANTS.LABEL.CLIENT);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadMachineProductType();
        });
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });
    }

    ngOnInit() {
        this.loadMachineProductType();
        this.loadClient();
    }

    loadMachineProductType(){
        $('body').addClass('loading');
        this.clientProductService.getAllMachineProductType(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.machineProductType = data['data'][0];
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([CLIENT_CONSTANTS.URL.CLIENT_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.clientService.getClients(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Machine' + ' ' + this.client.productTypeNickName + ' ' + 'List', CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE, true);
           this.breadCrumService.pushStep('Show Machine' + ' ' + this.client.productTypeNickName, CLIENT_CONSTANTS.URL.CLIENT_MACHINE_PRODUCT_TYPE_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
