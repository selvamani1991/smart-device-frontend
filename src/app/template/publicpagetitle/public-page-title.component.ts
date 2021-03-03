import { Component,Input,OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'public-page-title',
  templateUrl: './public-page-title.component.html',
  styleUrls: []
})
export class PublicPageTitleComponent implements OnInit {
    @Input() setting: any;
    constructor() {
    }

    ngOnInit() {

    }
}
