import { Component,Input } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'form-bottom',
  templateUrl: './form-bottom.component.html',
  styleUrls: []
})
export class FormBottomComponent {
    @Input() buttonName:string;
    @Input() backUrl:string;
    @Input() loading:boolean;
    @Input() form:any;
    constructor(translate: TranslateService,private router: Router) {

    }
    back() {
        this.router.navigate([this.backUrl]);
    }
}
