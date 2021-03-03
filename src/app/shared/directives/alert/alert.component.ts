import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../services/alert.service';


@Component({
    moduleId: module.id.toString(),
    selector: 'alert-message',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            if (message) {
                this.message = message;
            }else{
                this.message = undefined;
            }
        });
        this.alertService.showMessage();
    }
}
