import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'content-main',
  templateUrl: './content-main.component.html',
  styleUrls: []
})
export class ContentMainComponent {
    constructor(private contentMainRef: ElementRef) {
    }

    ngOnInit(): void {
        var self = this;
        var elem = $(self.contentMainRef.nativeElement).find('div.content-main');
        elem.css('height', window.innerHeight - 174);
        $('.main-content').find('.content-wrapper').css('min-height', window.innerHeight - 195);
        $('.main-content').find('.container-fluid').css('min-height', window.innerHeight - 261);

    }
}
