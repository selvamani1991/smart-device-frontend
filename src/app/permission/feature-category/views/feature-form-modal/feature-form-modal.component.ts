import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { FEATURE_CONSTANTS } from '../../constants';
import { FEATURE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';


@Component({
    selector: 'feature-form-modal',
    moduleId: module.id.toString(),
    templateUrl: 'feature-form-modal.component.html'
})

export class FeatureFormModalComponent implements OnInit {
    @Input() feature: any= {};
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    FEATURE_CONSTANTS= FEATURE_CONSTANTS;
    FEATURE_VALIDATOR= FEATURE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    buttonName= FEATURE_CONSTANTS.LABEL.FEATURE_ACTION_CREATE;
    buttonName1= FEATURE_CONSTANTS.LABEL.FEATURE_ACTION_EDIT;
    backUrl= FEATURE_CONSTANTS.URL.FEATURE_LIST;
    constructor(
) {
          this.APP_CONFIG = APP_CONFIG;
          this.FEATURE_CONSTANTS = FEATURE_CONSTANTS;
          this.FEATURE_VALIDATOR = FEATURE_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
    }
    ngOnInit() {

    }

    submitForm(form) {
      this.submitEvent.emit(form);
    }
}
