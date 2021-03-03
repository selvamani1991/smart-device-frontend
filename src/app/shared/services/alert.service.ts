import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private message: any;
    private keepAfterNavigationChange = false;

    constructor(private router: Router,
                private translate: TranslateService) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        let messageObj = { type: 'success', text: this.translate.instant(message), code: 'Success!!! ' };
        this.setMessage(messageObj);
        this.showMessage();
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        let messageObj = { type: 'error', text: this.translate.instant(message), code: 'Error!!! ' };
        this.setMessage(messageObj);
        this.showMessage();
    }

    showMessage() {
        let message = localStorage.getItem('message');
        if (message) {
          this.message = JSON.parse(message);
          localStorage.removeItem('message');
        }
        if (this.message) {
            this.subject.next(this.message);
        }
        delete this.message;
        let self = this;
        setTimeout(function(){
            this.message=null;
            self.subject.next(this.message);
        }, 5000);
    }

    setMessage(message) {
        this.message = message;
        localStorage.setItem('message', JSON.stringify(this.message));
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
