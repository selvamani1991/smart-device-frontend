import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APP_CONFIG } from '../../constants';
import { AUTH_CONSTANTS } from '../constants';
import { UserFeatureService } from './user-features.service';
import { HttpClientService } from '../../shared/services/http-client.service';



@Injectable()
export class AuthorizationService {
    CONFIG=APP_CONFIG;
    AUTH_CONSTANTS=AUTH_CONSTANTS;
    pageChange$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    isAdminSection=undefined;
    constructor(private httpClientService:HttpClientService, private userFeatureService: UserFeatureService ) {
        this.CONFIG=APP_CONFIG;
        this.AUTH_CONSTANTS=AUTH_CONSTANTS;
    }

    setAdminSection(isAdmin){
        this.isAdminSection=isAdmin;
        this.pageChange$.next(this.isAdminSection);
    }

    isPageAdmin(){
        return this.isAdminSection;
    }


}
