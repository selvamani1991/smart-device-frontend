import { Component } from '@angular/core';
import { APP_CONFIG } from '../../constants';
import { AUTH_CONSTANTS } from '../../auth/constants';
import { EXTERNAL_CONSTANTS } from '../../external/constants';
import { APP_CONSTANTS } from '../../constants';

import { AuthenticationService } from '../../auth/services/authentication.service';
import { AuthorizationService } from '../../auth/services/authorization.service';

@Component({
  selector: 'template-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent {
    currentUser = undefined;
    CONFIG= APP_CONFIG;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    APP_CONSTANTS= APP_CONSTANTS;
    EXTERNAL_CONSTANTS= EXTERNAL_CONSTANTS;
    isAdmin= false;
    constructor(private authenticationService: AuthenticationService,
                private authorizationService: AuthorizationService) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.APP_CONSTANTS = APP_CONSTANTS;
        this.EXTERNAL_CONSTANTS = EXTERNAL_CONSTANTS;
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );
        this.currentUser = authenticationService.getCurrentUser();

        this.authorizationService.pageChange$.subscribe(
            () => {
                this.isAdmin = authorizationService.isPageAdmin();
            }
        );
        this.currentUser = authenticationService.getCurrentUser();
    }
}
