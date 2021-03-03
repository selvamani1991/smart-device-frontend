import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {PRODUCT_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
    selector: 'qr-modal',
    moduleId: module.id.toString(),
    templateUrl: 'qr-modal.component.html'
})

export class QrModalComponent implements OnInit {
    @Input() product;
    @Input() productData;
    @Input() client;
    currentUser= undefined;
    @Output() submitEvent = new EventEmitter<number>();
    loading = false;
    alias: any;
    PRODUCT_CONSTANTS= PRODUCT_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private titleService: Title) {
          this.APP_CONFIG = APP_CONFIG;
          this.PRODUCT_CONSTANTS = PRODUCT_CONSTANTS;
          this.ERROR_CODE = ERROR_CODE;
          this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.PRODUCT_CONSTANTS.LABEL.PRODUCT_DATA_LIST);
          this.route.params.subscribe( params => {
              this.alias = params.alias;
          });
          this.authenticationService.sessionChange$.subscribe(
              () => {
                  this.currentUser = authenticationService.getCurrentUser();
              }
          );
    }

    ngOnInit() {
    }

    show(product) {
        this.router.navigate([PRODUCT_CONSTANTS.URL.PRODUCT_SHOW, product.alias]);
    }

}
