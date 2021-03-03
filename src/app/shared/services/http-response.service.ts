import { Injectable } from '@angular/core';

import { ERROR_CODE} from '../../constants';
import { AlertService } from './alert.service';
import { SweetAlertService } from './sweet-alert.service';

@Injectable()
export class HttpResponseService {
    constructor(private alertService: AlertService,
                private sweetAlertService: SweetAlertService) {


    }

    showErrorResponse(failure) {
        if (failure.status == ERROR_CODE.code_404) {
            this.sweetAlertService.notSuccessful('common.error.404');
            this.alertService.error('common.error.404', true);
        }else {
            if (failure.error.error){
                if (failure.error.error.errorCode == ERROR_CODE.code_5) {
                    this.sweetAlertService.notSuccessful(failure.error.error.errorMessageCode);
                    this.alertService.error(failure.error.error.errorMessageCode, true);
                    // this.router.navigate([APP_CONFIG.DASHBOARD]);
                }else {
                   this.sweetAlertService.notSuccessful(failure.error.error.errorMessageCode);
                   this.alertService.error(failure.error.error.errorMessageCode, true);
               }
            }else {
               this.sweetAlertService.notSuccessful('auth.view.accessDenied');
               this.alertService.error('auth.view.accessDenied', true);
            }
        }
    }


}
