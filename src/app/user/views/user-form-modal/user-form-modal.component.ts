import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { USER_CONSTANTS } from '../../constants';
import { USER_VALIDATOR } from '../../validator';
import { APP_CONFIG, USER_TYPES} from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    selector: 'user-form-modal',
    moduleId: module.id.toString(),
    templateUrl: 'user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit {
    @Input() user;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    USER_CONSTANTS= USER_CONSTANTS;
    USER_VALIDATOR= USER_VALIDATOR;
    USER_TYPES= USER_TYPES;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: USER_CONSTANTS.LABEL.USER
    };
    buttonName= USER_CONSTANTS.LABEL.USER_ACTION_CREATE;
    constructor(
                private router: Router,
                private userService: UserService,
                private sweetAlertService: SweetAlertService) {
          this.APP_CONFIG = APP_CONFIG;
          this.USER_CONSTANTS = USER_CONSTANTS;
          this.USER_VALIDATOR = USER_VALIDATOR;
          this.USER_TYPES = USER_TYPES;
          this.ERROR_CODE = ERROR_CODE;

    }

    ngOnInit() {
        if (this.user.id) {
            this.buttonName = USER_CONSTANTS.LABEL.USER_ACTION_EDIT;
        }
    }

    validatePassword(user, form) {
        if (user.password === user.confirmPassword) {
            if (form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD]) {
                form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD].setErrors(null);
            }
            return true;
        }else {
            if (form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD]) {
                form.form.controls[USER_CONSTANTS.FIELD.CONFIRM_PASSWORD].setErrors({match: true});
            }
            return false;
        }

    }

    createCall(user, form) {
        $('body').addClass('loading');
        this.userService.saveUser(user)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data, form);
            } else {
                this.sweetAlertService.createConfirmation(this.setting.entity);
                $('#userCreateModal').modal('hide');
                this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.error.error.errorMessageCode);
            $('#userCreateModal').modal('hide');
            this.loading = false;
            this.submitEvent.emit(1);
        });
    }

    updateUser() {
        this.loading = true;
        this.userService.updateUser(this.user.alias)
        .subscribe(
        data => {
            if (data['hasError']) {
              this.user = data['data'][0];
            } else {
              $('#userCreateModal').modal('hide');
              this.sweetAlertService.updateConfirmation(this.setting.entity);
              this.submitEvent.emit(1);
            }
            this.loading = false;
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
            this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
            this.loading = false;
            this.submitEvent.emit(1);
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            form.form.controls[data.error.errorField].setErrors({duplicate: true});
        }
    }

    submitForm(user, form) {
        if (user.id) {
            this.updateUser();
        }else {
            this.createCall(user, form);
        }

    }

    validate(user, form) {
        var validForm = true;
        if (!user.userType) {
             form.form.controls['userType'].setErrors({'required': true});
             validForm = false;
        }
        return validForm;
    }
}
