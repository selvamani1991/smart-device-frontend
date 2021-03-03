import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ADMIN_FORM_CONSTANTS } from '../constants';
import { ERROR_CODE } from '../../constants';


@Injectable()
export class AdminService {
    form: FormGroup;
    constructor() {
    }

    getAdminForm(_formBuilder: FormBuilder, admin) {
        this.form = _formBuilder.group({
            id              : new FormControl(admin.id),
            firstName       : new FormControl(admin.firstName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            lastName        : new FormControl(admin.lastName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            email           : new FormControl(admin.email, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
            designation     : new FormControl(admin.designation, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            phoneNo         : new FormControl(admin.phoneNo, [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]),
            landLineNo      : new FormControl(admin.landLineNo, [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]),
            password        : new FormControl(admin.password, [Validators.required, Validators.minLength(3)]),
            confirmPassword : new FormControl(admin.confirmPassword, [Validators.required, Validators.minLength(3)])
        });
        return this.form;
    }


    getAdminEditForm(_formBuilder: FormBuilder, admin) {
        this.form = _formBuilder.group({
            id              : new FormControl(admin.id),
            firstName       : new FormControl(admin.firstName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            lastName        : new FormControl(admin.lastName, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            email           : new FormControl(admin.email, [Validators.required, Validators.email,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
            designation     : new FormControl(admin.designation, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            phoneNo         : new FormControl(admin.phoneNo, [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]),
            landLineNo      : new FormControl(admin.landLineNo, [Validators.required, Validators.pattern(/^\+?[0-9-]+$/)]),
        });
        return this.form;
    }

    validateForm() {
        let valid = true;
        if (this.form.get(ADMIN_FORM_CONSTANTS.FIELD.PASSWORD).value === this.form.get(ADMIN_FORM_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.form.get(ADMIN_FORM_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
        }else {
            this.form.get(ADMIN_FORM_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({match: true});
            valid = false;
        }
        return valid;
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            /* if (data.error.errorField == ADMIN_FORM_CONSTANTS.FIELD.PHONE_NUMBER) {
                this.form.get(ADMIN_FORM_CONSTANTS.FIELD.PHONE_NUMBER_FIELD).setErrors({'duplicate': true});
            } */
            if (data.error.errorField == ADMIN_FORM_CONSTANTS.FIELD.EMAIL) {
                this.form.get(ADMIN_FORM_CONSTANTS.FIELD.EMAIL_FIELD).setErrors({'duplicate': true});
            }
        }
    }
}
