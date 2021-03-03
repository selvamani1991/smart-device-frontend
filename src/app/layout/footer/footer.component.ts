import { Component, ElementRef } from '@angular/core';

import { APP_CONFIG } from '../../constants';
import { AUTH_CONSTANTS } from '../../auth/constants';
import { EXTERNAL_CONSTANTS } from '../../external/constants';
import { MAIN_CONSTANTS } from '../../main/constants';
import { APP_CONSTANTS } from '../../constants';

@Component({
  selector: 'template-footer',
  templateUrl: './footer.component.html',
  styleUrls: []
})
export class FooterComponent {
    CONFIG= APP_CONFIG;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    APP_CONSTANTS= APP_CONSTANTS;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    EXTERNAL_CONSTANTS= EXTERNAL_CONSTANTS;
    constructor(private containerMainRef : ElementRef) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        this.APP_CONSTANTS = APP_CONSTANTS;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.EXTERNAL_CONSTANTS = EXTERNAL_CONSTANTS;
    }

    ngOnInit(): void {
        let self = this;
        let elem = $(self.containerMainRef.nativeElement).find('.footer-wrapper');
        elem.mouseenter(function(){
            if ( elem.find('.footer-top').is( ':hidden' ) ) {
                $( '.footer-top' ).slideDown( 'slow' );
            }
        });
        elem.mouseleave(function(){
            $( '.footer-top' ).slideUp( 'slow' );
        });
    }
}
