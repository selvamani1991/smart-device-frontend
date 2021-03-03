import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent {
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(private titleService: Title,
                private containerMainRef: ElementRef) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.HOME_LINK);
    }

    ngOnInit(): void {
        let self = this;
        let elem = $(self.containerMainRef.nativeElement).find('div#myCarousel');
        elem.css('height', window.innerHeight - 130);
        elem.find('.carousel-inner').css('height', window.innerHeight - 150);
    }


}
