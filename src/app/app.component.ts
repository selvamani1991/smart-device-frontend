import { Component,OnInit,ElementRef } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title }     from '@angular/platform-browser';
import { APP_CONFIG } from './constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: []
})
export class AppComponent {
    APP_CONFIG = APP_CONFIG;
    constructor(private translate: TranslateService,private titleService: Title) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
        this.APP_CONFIG=APP_CONFIG;
        this.titleService.setTitle( APP_CONFIG.APP_NAME );
    }

    ngOnInit():void {
        $('#preloader').fadeOut(500);
        $('#main-wrapper').addClass('show');
        $('body').attr('data-sidebar-style') === "mini" ? $(".hamburger").addClass('is-active') : $(".hamburger").removeClass('is-active');
    }

}
