import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { FEATURE_CATEGORY_CONSTANTS } from '../../constants';
import { FEATURE_CATEGORY_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';


@Component({
    selector: 'category-form-modal',
    moduleId: module.id.toString(),
    templateUrl: 'category-form-modal.component.html'
})

export class CategoryFormModalComponent implements OnInit {
    @Input() featureCategory;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    FEATURE_CATEGORY_CONSTANTS= FEATURE_CATEGORY_CONSTANTS;
    FEATURE_CATEGORY_VALIDATOR= FEATURE_CATEGORY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY

    };
    steps= [];
    buttonName= FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_ACTION_CREATE;
    buttonName1= FEATURE_CATEGORY_CONSTANTS.LABEL.FEATURE_CATEGORY_ACTION_EDIT;
    backUrl= FEATURE_CATEGORY_CONSTANTS.URL.FEATURE_CATEGORY_LIST;
    constructor(
        ) {
          this.APP_CONFIG = APP_CONFIG;
          this.FEATURE_CATEGORY_CONSTANTS = FEATURE_CATEGORY_CONSTANTS;
          this.FEATURE_CATEGORY_VALIDATOR = FEATURE_CATEGORY_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
    }

    ngOnInit() {
    }

    submitForm(form) {
      this.submitEvent.emit(form);
    }
}
