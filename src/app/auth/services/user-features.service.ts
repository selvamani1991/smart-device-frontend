import { Injectable } from '@angular/core';

import { HttpClientService } from '../../shared/services/http-client.service';
import { AUTH_CONSTANTS } from '../constants';

@Injectable()
export class UserFeatureService {
    AUTH_CONSTANTS=AUTH_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.AUTH_CONSTANTS=AUTH_CONSTANTS;
    }

    loadDashboard(userId: string) {
        return this.httpClientService.getRequest(this.AUTH_CONSTANTS.API.DASHBOARD.replace(':userId',userId),{});
    }

    loadFeatures(userId: string) {
        return this.httpClientService.getRequest(this.AUTH_CONSTANTS.API.FEATURES.replace(':userId',userId),{});
    }
}