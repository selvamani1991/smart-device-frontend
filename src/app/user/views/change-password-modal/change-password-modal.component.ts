import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { USER_CONSTANTS } from '../../constants';
import { USER_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
    selector: 'change-password-modal',
    moduleId: module.id.toString(),
    templateUrl: 'change-password-modal.component.html'
})

export class ChangePasswordModalComponent implements OnInit {
    @Input() user;
    @Output() submitEvent = new EventEmitter<number>();
    passwordUser: any= {};
    loading = false;
    USER_CONSTANTS= USER_CONSTANTS;
    USER_VALIDATOR= USER_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: USER_CONSTANTS.LABEL.USER
    };
    buttonName= USER_CONSTANTS.LABEL.USER_ACTION_EDIT;
    constructor(
        private userService: UserService,
        private sweetAlertService: SweetAlertService) {
          this.APP_CONFIG = APP_CONFIG;
          this.USER_CONSTANTS = USER_CONSTANTS;
          this.USER_VALIDATOR = USER_VALIDATOR;
          this.ERROR_CODE = ERROR_CODE;

    }

    ngOnInit() {
      this.passwordUser = {};
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

    updateUser(user, form) {
        this.loading = true;
        $('body').addClass('loading');
        var newUser = {'id': this.user.id, 'password': user.password, 'tempPassword': user.tempPassword, 'alias': this.user.alias, 'username': this.user.username, 'isActive': this.user.isActive};
        this.userService.updatePassword(this.user.alias, newUser)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }else {
                this.user = data['data'][0];
                if (this.user.tempPassword == 'failed') {
                    form.form.controls[USER_CONSTANTS.FIELD.OLD_PASSWORD].setErrors({'match': true});
                }else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    $('#changePasswordModal').modal('hide');
                    this.passwordUser = {};
                }
            }
            this.loading = false;
        },
        error => {
            $('body').removeClass('loading');
            this.sweetAlertService.notSuccessful(error.error.error.errorMessageCode);
            this.loading = false;
            $('#changePasswordModal').modal('hide');
            this.passwordUser = {};
        });
    }

    submitForm(user, form) {
        this.updateUser(user, form);

    }
}
