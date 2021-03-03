import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MEDIA_CONSTANTS } from '../../constants';
import { PRODUCT_TYPE_CONSTANTS } from '../../../product-type/constants';
import { APP_CONFIG } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { MediaService } from '../../services/media.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { ProductTypeService } from '../../../product-type/services/product-type.service';
import { TooltipService } from '../../../shared/services/tooltip.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';


@Component({
    moduleId: module.id.toString(),
    templateUrl: 'media-list.component.html'
})
export class MediaListComponent implements OnInit {
    medias: any = [];
    form: any= {};
    alias: any= {};
    media: any= {};
    client: any= {};
    currentUser= undefined;
    productType: any= {};
    loading = false;
    MEDIA_CONSTANTS= MEDIA_CONSTANTS;
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MEDIA_CONSTANTS.LABEL.MEDIA,
        pageTitle: MEDIA_CONSTANTS.LABEL.MEDIA_LIST,
        pageDesc: MEDIA_CONSTANTS.LABEL.MEDIA_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private mediaService: MediaService,
                private alertService: AlertService,
                private breadCrumService: BreadCrumService,
                private productTypeService: ProductTypeService,
                private sweetAlertService: SweetAlertService,
                private httpResponseService: HttpResponseService,
                private authenticationService: AuthenticationService,
                private tooltipService: TooltipService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.MEDIA_CONSTANTS = MEDIA_CONSTANTS;
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MEDIA_CONSTANTS.LABEL.MEDIA);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadMediaByProductType();
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
    }

    ngOnInit() {
        this.loadProductType();
        this.loadClient();
    }

    loadMediaByProductType() {
        this.loading = true;
        $('body').addClass('loading');
        this.mediaService.getMediaByProductType(this.currentPage, this.pageSize, this.query, this.alias)
        .subscribe(
            data => {
                $('body').removeClass('loading');
               this.medias = data['data'];
               this.paginationItems = this.medias;
               this.itemSize = this.paginationItems.length;
               this.currentPage = data['page'];
               this.pageSize = data['pageSize'];
               this.totalSize = data['count'];
               let reminder = this.totalSize % this.pageSize;
               this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
               this.loading = false;
               this.tooltipService.enable();

            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
                this.loading = false;
            }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadMediaByProductType();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadMediaByProductType();
    }

    addMedia() {
        this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_CREATE, this.alias]);
    }

    show(media) {
        this.tooltipService.clear();
        this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_SHOW, media.alias]);
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === MEDIA_CONSTANTS.FIELD.NAME) {
                form.form.controls[MEDIA_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchMedia(newValue) {
        let myModel = newValue;
        if (myModel.length > 1) {
            this.query = myModel;
            this.currentPage=1;
            this.loadMediaByProductType();
        } else {
            this.query = '';
            this.loadMediaByProductType();
        }
    }

    changeStatus(media, status) {
        media.active = status;
        this.mediaService.updateMedia(media)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MEDIA_LIST, this.alias]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MEDIA_LIST, this.alias]);
            this.loading = false;
        });
    }

    markDeleted(media) {
        this.sweetAlertService.deleteCheck(this, media);
    }

    remove(media) {
        this.mediaService.deleteMedia(media.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                media.isDeleted = true;
                media.isActive = false;
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_MEDIA_LIST, this.alias]);
                this.loadMediaByProductType();
            } else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    loadProductType() {
        this.productTypeService.getProductType(this.alias)
        .subscribe(
        data => {
            this.productType = data['data'][0];
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.loading = false;
        });
    }

    loadClient() {
        this.mediaService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
            this.breadCrumService.pushStep(this.client.productTypeNickName+ ' ' + 'List',PRODUCT_TYPE_CONSTANTS.URL.PRODUCT_TYPE_LIST,true);
            this.breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.MEDIA_LIST_LINK, MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST, false);
            this.steps = this.breadCrumService.getSteps();
        },
        () => {
            this.loading = false;
        });
    }
}
