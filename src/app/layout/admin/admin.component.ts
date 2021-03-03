import { Component, OnInit, ElementRef } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'admin-root',
  templateUrl: './admin.component.html',
  styleUrls: []
})
export class AdminComponent {
    constructor(private containerMainRef: ElementRef) {
    }
    ngOnInit(): void {
        let win_h = $( window ).height();
        if (win_h > 0 ? win_h : screen.height) {
            $('.content-body').css('min-height', (win_h - 100) + 'px');
        }
        setTimeout(function(){
            //$('app-root').siblings().hide();
        },500)
    }
}
