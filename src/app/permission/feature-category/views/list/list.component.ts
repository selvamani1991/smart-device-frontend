import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { FEATURE_CATEGORY_CONSTANTS } from '../../constants';
import { FEATURE_CONSTANTS } from '../../constants';

import { APP_CONFIG } from '../../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../../constants';

import { FeatureCategoryService } from '../../services/feature-category.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';
import { FeatureService} from '../../services/feature.service';

import { AlertService } from '../../../../shared/services/alert.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { TooltipService } from '../../../../shared/services/tooltip.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    featureCategories: any = [];
    featureCategory: any = {};
    form: any = {};
    Features: any= {};
    features: any= [];
    loading = false;
    FEATURE_CATEGORY_CONSTANTS= FEATURE_CATEGORY_CONSTANTS;
    FEATURE_CONSTANTS= FEATURE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    setting = {
        entity: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY,
        pageTitle: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_LIST,
        pageDesc: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    alias: any;
    constructor(
    private router: Router,
    private featureCategoryService: FeatureCategoryService,
    private httpResponseService: HttpResponseService,
    private alertService: AlertService,
    private tooltipService: TooltipService,
    private featureService: FeatureService,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.FEATURE_CATEGORY_CONSTANTS = FEATURE_CATEGORY_CONSTANTS;
        this.FEATURE_CONSTANTS = FEATURE_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_LIST_LINK, FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY);
    }

    ngOnInit() {
        this.loadFeatures();
        this.tooltipService.enable();
    }

    loadFeatures() {
        this.loading = true;
        $('body').addClass('loading');
        this.featureCategoryService.getAllFeatureCategory(this.currentPage, this.pageSize, this.query)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                this.featureCategories = data['data'];
                this.paginationItems = this.featureCategories;
                this.itemSize = this.paginationItems.length;
                this.currentPage = data['page'];
                this.pageSize = data['pageSize'];
                this.totalSize = data['count'];
                var reminder = this.totalSize % this.pageSize;
                this.totalPages = reminder === 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
                this.loading = false;
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
            }
        );
    }

    loadFeatureCategory() {
        this.featureCategoryService.getFeatureCategory(this.alias)
        .subscribe(
        data => {
            this.featureCategory = data['data'][0];
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
            this.loading = false;
        }
        );
    }

    changePage(event) {
        this.currentPage = event;
        this.loadFeatures();
    }

    changePageSize(event) {
        this.pageSize = event;
        this.loadFeatures();
    }

    addNew() {
        this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_CREATE]);
    }

    show(featureCategory) {
        this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_SHOW, featureCategory.alias]);
    }

    createFeatureCategory() {
        this.featureCategoryService.saveFeatureCategory(this.featureCategory)
        .subscribe(
            data => {
                if (data['hasError']) {
                } else {
                    this.featureCategory = data['data'][0];
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    $('#categoryFormModal').modal('hide');
                    this.loadFeatures();
                }
                this.loading = false;
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
            }
        );
    }

    edit(featureCategory) {
         this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_EDIT, featureCategory.alias]);
    }

    /*markDeleted(feature){
         this.sweetAlertService.deleteCheck(this,feature);
    }*/

    markDeleted(featureCategory) {
        this.sweetAlertService.deleteCheck(this, featureCategory);
    }

    remove(featureCategory) {
        this.featureCategoryService.deleteFeatureCategory(featureCategory.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode === SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
                this.loadFeatureCategory();
            } else {
            this.sweetAlertService.notSuccessful(data['error'].errorMessage);
        }
    },
    error => {
        this.alertService.error(error.message);
        this.loading = false;
        });
    }

    reloadList() {
        this.loadFeatureCategory();
    }


    /*remove(object){
        if(object.features){
            //this.tooltipService.clear();
            this.featureCategoryService.deleteFeatureCategory(object.id)
            .subscribe(
                data => {
                if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                this.sweetAlertService.deleteConfirmation(this.setting.entity);
                //this.tooltipService.enable();
                }
                else {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                }
                },
                error => {
                this.alertService.error(error.message);
                this.loading = false;
                //this.tooltipService.enable();
            });
        }else{
            //this.tooltipService.clear();
            this.featureService.deleteFeature(object.id)
            .subscribe(
                data => {
                    if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
                        this.loadFeatureCategory(this.alias);
                        this.sweetAlertService.deleteConfirmation(this.setting.entity);
                        //this.tooltipService.enable();
                    }
                    else {
                        this.sweetAlertService.notSuccessful(data['error'].errorMessage);
                    }
                },
                error => {
                    this.alertService.error(error.message);
                    this.loading = false;
                    //this.tooltipService.enable();
                }
            );
        }
    }*/

    lockFeature(feature) {
        this.tooltipService.clear();
        this.featureService.featureLock(feature)
        .subscribe(
            data => {
                if (!data['hasError'] ) {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.loadFeatureCategory();
                }
                this.tooltipService.enable();
            },
            error => {
                this.alertService.error(error.message);
                this.loading = false;
                this.tooltipService.enable();
            }
        );
    }
    changeStatus(featureCategory, status) {
        featureCategory.active = status;
        this.featureCategoryService.updateFeatureCategory(this.alias, featureCategory)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data, this.form);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
            }
            this.loading = false;
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
            this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === FEATURE_CATEGORY_CONSTANTS.FIELD.NAME) {
                form.form.controls[FEATURE_CATEGORY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

}
