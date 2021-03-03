import { Component, Input } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'form-control-label',
  templateUrl: './form-control-label.component.html',
  styleUrls: []
})
export class FormControlLabelComponent {
    @Input() text: string;
    @Input() required: boolean;
    constructor(translate: TranslateService, private router: Router) {

    }
}
