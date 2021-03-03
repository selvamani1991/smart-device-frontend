import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ROLE_CONSTANTS } from '../../constants';
import { ROLE_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../../constants';
import { ERROR_CODE } from '../../../../constants';


@Component({
    selector: 'role-feature-modal',
    moduleId: module.id.toString(),
    templateUrl: 'role-feature-modal.component.html'
})
export class RoleFeatureModalComponent implements OnInit {
    @Input() roleFeature;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    notExecute= false;
    crud= false;
    ROLE_CONSTANTS= ROLE_CONSTANTS;
    ROLE_VALIDATOR= ROLE_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: ROLE_CONSTANTS.LABEL.ROLE,
    };
    steps= [];
    buttonName= ROLE_CONSTANTS.LABEL.ROLE_ACTION_EDIT;
    backUrl= ROLE_CONSTANTS.URL.ROLE_LIST;
    constructor(
        ) {
          this.APP_CONFIG = APP_CONFIG;
          this.ROLE_CONSTANTS = ROLE_CONSTANTS;
          this.ROLE_VALIDATOR = ROLE_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;
    }
    ngOnInit() {
    }

    submitForm() {
      this.submitEvent.emit(1);
    }

    selectCrud(roleFeature) {
        if (roleFeature.crud) {
            roleFeature.createRight = true;
            roleFeature.readRight = true;
            roleFeature.updateRight = true;
            roleFeature.deleteRight = true;
            roleFeature.executeRight = false;
            this.notExecute = true;
        }else {
            roleFeature.createRight = false;
            roleFeature.readRight = false;
            roleFeature.updateRight = false;
            roleFeature.deleteRight = false;
            this.notExecute = false;
        }
    }

    updatePermission(roleFeature) {
        if (roleFeature.executeRight) {
            roleFeature.createRight = false;
            roleFeature.readRight = false;
            roleFeature.updateRight = false;
            roleFeature.deleteRight = false;
            roleFeature.crud = false;
        }else {
          if (roleFeature.updateRight || roleFeature.deleteRight) {
              roleFeature.readRight = true;
              this.notExecute = true;
          }
          console.log(roleFeature);
          if (!roleFeature.readRight) {
            roleFeature.updateRight = false;
            roleFeature.deleteRight = false;
          }
        }
    }
}
