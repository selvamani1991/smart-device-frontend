import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BOARD_MANUFACTURER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { BoardProductService } from '../../services/board-product.service';
import { BoardManufacturerService } from '../../services/board-manufacturer.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'board-productType-show.component.html'
})

export class BoardProductTypeShowComponent implements OnInit {
    loading = false;
    boardProductType: any= {};
    client: any= {};
    services: any= [];
    currentUser=undefined;
    boardProductTypeForm: FormGroup;
    BOARD_MANUFACTURER_CONSTANTS= BOARD_MANUFACTURER_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
        entity: BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER,
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
                private authenticationService: AuthenticationService,
                private boardProductService: BoardProductService,
                private boardManufacturerService: BoardManufacturerService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.BOARD_MANUFACTURER_CONSTANTS = BOARD_MANUFACTURER_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadBoardProductType();
        });
        this.authenticationService.sessionChange$.subscribe(
        () => {
            this.currentUser = authenticationService.getCurrentUser();
        });
    }

    ngOnInit() {
        this.loadBoardProductType();
        this.loadClient();
    }

    loadBoardProductType() {
        $('body').addClass('loading');
        this.boardProductService.getBoardProductType(this.alias)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            this.boardProductType = data['data'][0];
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_LIST]);
            this.loading = false;
        });
    }

    loadClient() {
        this.boardManufacturerService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
           this.client = data['data'][0];
           this.breadCrumService.pushStep('Board' + ' ' + this.client.productTypeNickName + ' ' + 'List', BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE, true);
           this.breadCrumService.pushStep(BOARD_MANUFACTURER_CONSTANTS.LABEL.BOARD_MANUFACTURER_SHOW_LINK, BOARD_MANUFACTURER_CONSTANTS.URL.BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE_SHOW, false);
           this.steps = this.breadCrumService.getSteps();
        },
        () => {
           this.loading = false;
        });
    }
}
