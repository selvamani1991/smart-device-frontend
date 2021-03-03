import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { FEATURE_CATEGORY_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';
import { FEATURE_CATEGORY_VALIDATOR } from '../../validator';
import { FeatureCategoryService } from '../../services/feature-category.service';
import { BreadCrumService } from '../../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    featureCategory: any= {};
    featureCategories= [];
    featureCategoryForm: FormGroup;
    FEATURE_CATEGORY_VALIDATOR= FEATURE_CATEGORY_VALIDATOR;
    FEATURE_CATEGORY_CONSTANTS= FEATURE_CATEGORY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
    entity: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY,
    pageTitle: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_EDIT,
    pageDesc: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_EDIT_DESC
    };
    steps= [];
    buttonName= FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_ACTION_EDIT;
    backUrl= FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorFeatureCategoryname: false,
        duplicateErrorEmail: false
    };
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private featureCategoryService: FeatureCategoryService,
        private _formBuilder: FormBuilder,
        private httpResponseService: HttpResponseService,
        breadCrumService: BreadCrumService,
        private sweetAlertService: SweetAlertService,
        private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.FEATURE_CATEGORY_CONSTANTS = FEATURE_CATEGORY_CONSTANTS;
        this.FEATURE_CATEGORY_VALIDATOR = FEATURE_CATEGORY_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_LIST_LINK, FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST, true);
        breadCrumService.pushStep(FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_EDIT_LINK, FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadFeatureCategory(this.alias);
        });
    }

    ngOnInit() {
         this.featureCategoryForm = this.createFeatureCategoryForm();
        this.loadFeatureCategory(this.alias);
    }

    createFeatureCategoryForm(): FormGroup {
        return this.featureCategoryForm = this._formBuilder.group({
            id                  : [this.featureCategory.id],
            name                : [this.featureCategory.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            description         : [this.featureCategory.description, [Validators.required, Validators.minLength(3)]],
            state               : [this.featureCategory.state, [Validators.required, Validators.minLength(3)]],
            translation         : [this.featureCategory.translation, [Validators.required, Validators.minLength(3)]],
            icon                : [this.featureCategory.icon, [Validators.required, Validators.minLength(3)]],
        });
    }

    loadFeatureCategory(alias) {
        this.featureCategoryService.getFeatureCategory(alias)
        .subscribe(
            data => {
                this.featureCategory = data['data'][0];
                this.featureCategoryForm = this.createFeatureCategoryForm();
            },
            failure => {
                this.httpResponseService.showErrorResponse(failure);
                this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
            }
        );

    }

    update(featureCategory, form) {
        this.featureCategory = this.featureCategoryForm.value;
        $('body').addClass('loading');
        featureCategory.id = this.featureCategory.id;
        this.featureCategoryService.updateFeatureCategory(this.featureCategory.alias, this.featureCategory)
        .subscribe(
            data => {
                $('body').removeClass('loading');
                if (data['hasError']) {
                    this.assignResponseError(data, form);
                } else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
                }
                this.loading = false;
            },
            failure => {
                $('body').removeClass('loading');
                this.httpResponseService.showErrorResponse(failure);
            }
        );
    }

    assignResponseError(data, form) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === FEATURE_CATEGORY_CONSTANTS.FIELD.NAME) {
                  form.form.controls[FEATURE_CATEGORY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST]);
    }

}
