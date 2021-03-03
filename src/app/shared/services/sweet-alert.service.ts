import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class SweetAlertService {
    constructor(private translate: TranslateService) {
    }

    createConfirmation(entity) {
        swal({
            title: entity + this.translate.instant('sweet.alert.created'),
            text: this.translate.instant('sweet.alert.created_msg'),
            type: this.translate.instant('sweet.alert.success')
        });
    }

    updateConfirmation(entity) {
        swal({
            title: entity + this.translate.instant('sweet.alert.updated'),
            text: this.translate.instant('sweet.alert.updated_msg'),
            type: this.translate.instant('sweet.alert.success')
        });
    }

    deleteConfirmation(entity) {
        swal({
            title: entity + this.translate.instant('sweet.alert.deleted'),
            text: this.translate.instant('sweet.alert.deleted_msg'),
            type: this.translate.instant('sweet.alert.success')
        });
    }

    deleteImage(entity) {
        swal({
            title: entity + this.translate.instant('sweet.alert.deleted'),
            text: this.translate.instant('sweet.alert.deleted_image'),
            type: this.translate.instant('sweet.alert.success')
        });
    }

    unsuccessful() {
        swal({
            title:  this.translate.instant('sweet.alert.oops'),
            text:  this.translate.instant('sweet.alert.error_msg'),
            type: this.translate.instant('sweet.alert.error')
        });
    }

    uploadSuccessfully(entity) {
        swal({
            title: entity + this.translate.instant('sweet.alert.upload'),
            text: this.translate.instant('sweet.alert.upload_msg'),
            type: this.translate.instant('sweet.alert.success')
        });
    }


    assign(entity) {
        swal({
            title:  this.translate.instant('sweet.alert.assign'),
            text:  this.translate.instant('sweet.alert.assign_msg'),
            type: this.translate.instant('sweet.alert.success')
        });
    }

    notSuccessful(message) {
        swal({
            title: this.translate.instant('sweet.alert.oops'),
            text: this.translate.instant(message),
            type: this.translate.instant('sweet.alert.error')
        });
    }

    deleteCheck(scope, object) {
        swal({
            title: this.translate.instant('sweet.alert.sure'),
            text: this.translate.instant('sweet.alert.delete_confirm'),
            type: this.translate.instant('sweet.alert.warning'),
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: this.translate.instant('sweet.alert.yes_delete'),
            cancelButtonText: this.translate.instant('sweet.alert.no_delete'),
            // closeOnConfirm: false,
            // closeOnCancel: false
        }).then((result) => {
            if (result.value) {
                scope.remove(object);
            }else {
                swal({
                    title: this.translate.instant('sweet.alert.cancelled'),
                    text: this.translate.instant('sweet.alert.cancelled_msg'),
                    type: this.translate.instant('sweet.alert.error')
                });
            }
        });
    }
}
