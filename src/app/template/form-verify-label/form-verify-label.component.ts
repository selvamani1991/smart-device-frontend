import { Component, Input } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'form-verify-label',
  templateUrl: './form-verify-label.component.html',
  styleUrls: []
})
export class FormVerifyLabelComponent {
    @Input() check: boolean;
    constructor(translate: TranslateService, private router: Router) {

    }
}
