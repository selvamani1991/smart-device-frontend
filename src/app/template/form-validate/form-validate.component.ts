import { Component, Input, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'form-validate',
  templateUrl: './form-validate.component.html',
  styleUrls: []
})
export class FormValidateComponent implements OnInit{
    @Input() field;
    @Input() entity;
    @Input() form;
    @Input() fieldName;
    @Input() check?: boolean;
    @Input() messages;
    message: any= {}
    constructor() {
    }

    ngOnInit() {
        for (let i = 0; i < this.messages.length; i++){
          if (this.fieldName == this.messages[i].name) {
            this.message = this.messages[i].messages;
          }
        }
    }
}
