import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { FEATURE_CATEGORY_CONSTANTS } from '../../constants';
import { FEATURE_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import { SUCCESS_CODE } from '../../../../constants';
import { FeatureCategoryService} from '../../services/feature-category.service';
import { FeatureService} from '../../services/feature.service';

import { AlertService } from '../../../../shared/services/alert.service';
import { TooltipService } from '../../../../shared/services/tooltip.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
moduleId: module.id.toString(),
templateUrl: 'show.component.html'
})
export class ShowComponent implements OnInit {
    loading = false;
    featureCategory: any= {};
    featureCategories= [];
    feature: any= {};
    features: any= [];
    FEATURE_CATEGORY_CONSTANTS= FEATURE_CATEGORY_CONSTANTS;
    FEATURE_CONSTANTS= FEATURE_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    SUCCESS_CODE= SUCCESS_CODE;
    setting = {
        entity: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY,
        pageTitle: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_SHOW,
        pageDesc: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_SHOW_DESC
    };
    subSetting = {
        entity: FEATURE_CONSTANTS.LABEL.FEATURE
    };
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    steps= [];
    alias: any= {};
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private featureCategoryService: FeatureCategoryService,
        private featureService: FeatureService,
        private alertService: AlertService,
        private tooltipService: TooltipService,
        breadCrumService: BreadCrumService,
        private sweetAlertService: SweetAlertService,
        private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.FEATURE_CATEGORY_CONSTANTS = FEATURE_CATEGORY_CONSTANTS;
        this.FEATURE_CONSTANTS = FEATURE_CONSTANTS;
        this.ERROR_CODE = ERROR_CODE;
        this.SUCCESS_CODE = SUCCESS_CODE;
        breadCrumService.pushStep(FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_LIST_LINK, FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST, true);
        breadCrumService.pushStep(FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_SHOW_LINK, FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadFeatureCategory(this.alias);
        });
    }

    ngOnInit() {
        this.tooltipService.enable();
    }

    loadFeatureCategory(alias) {
        this.featureCategoryService.getFeatureCategory(alias)
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

    markDeleted(feature) {
        this.sweetAlertService.deleteCheck(this, feature);
    }

    edit() {
        this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_EDIT, this.featureCategory.alias]);
    }

    editFeature(feature) {
        this.feature = feature;
        $('#featureFormModal').modal();
    }

    updateFeatureCategory(form) {
        this.updateCall(form);
    }

    updateCall(form) {
        this.loading = true;
         $('body').addClass('loading');
        this.tooltipService.clear();
        this.featureCategoryService.updateFeatureCategory(this.featureCategory.alias, this.featureCategory)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                if (data['hasError']) {
                     this.assignResponseError(data, form);
                } else {
                    $('#categoryFormModal').modal('hide');
                    $('#featureFormModal').modal('hide');
                    this.loadFeatureCategory(this.alias);
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                }
                this.loading = false;
                this.tooltipService.enable();
            },
            error => {
                $('body').removeClass('loading');
                this.sweetAlertService.notSuccessful(error.message);
                this.loading = false;
                this.tooltipService.enable();
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === FEATURE_CONSTANTS.FIELD.NAME) {
                form.form.controls[FEATURE_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    show(feature) {
         this.router.navigate([FEATURE_CONSTANTS.URL.FEATURE_SHOW, feature.alias]);
    }

    addNew() {
        this.feature = {};
        $('#featureFormModal').modal();
    }

    updateFeature(form) {
        if (!this.feature.id) {
            console.log(this.feature);
            this.featureCategory.features.push(this.feature);
        }
        this.updateCall(form);
    }

    changeStatus(featureCategory) {
        this.featureCategory = featureCategory;
        this.featureCategory.active = !this.featureCategory.active;
        this.updateCall(null);
    }

    changeStatusFeature(feature) {
        feature.active = !feature.active;
        this.updateCall(null);
    }

    lockFeature(feature) {
    this.tooltipService.clear();
        this.featureService.featureLock(feature)
        .subscribe(
            data => {
                if (!data['hasError'] ) {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.loadFeatureCategory(this.alias);
                }
                this.tooltipService.enable();
            },
            error => {
                this.alertService.error(error.message);
                this.loading = false;
                this.tooltipService.enable();
        });
    }
}
