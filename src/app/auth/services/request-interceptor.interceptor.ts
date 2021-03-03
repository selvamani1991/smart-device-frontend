import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    currentUser=undefined;
    constructor() {
        if(Boolean(localStorage.getItem('currentUser'))) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
    }

    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(Boolean(localStorage.getItem('currentUser'))){
            this.currentUser=JSON.parse(localStorage.getItem('currentUser'));
        }
        else{
            this.currentUser=undefined;
        }
        if(this.currentUser){
            request = request.clone({
                setHeaders: {
                    auth_token: this.currentUser.authToken,
                    userName: this.currentUser.username
                    }
            });
        }
        return next.handle(request);
    }
}