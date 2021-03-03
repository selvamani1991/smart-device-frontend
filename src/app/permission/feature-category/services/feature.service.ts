import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';
import { FEATURE_CONSTANTS } from '../constants';

@Injectable()
export class FeatureService {
    FEATURE_CONSTANTS=FEATURE_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.FEATURE_CONSTANTS=FEATURE_CONSTANTS;
    }

    getAllFeature(page,pageSize){
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.getRequest(this.FEATURE_CONSTANTS.API.FEATURE+data,{});
    }

    getFeatureCategories(){
        return this.httpClientService.getRequest(this.FEATURE_CONSTANTS.API.FEATURE_CATEGORIES,{});
    }

    getFeature(alias){
        return this.httpClientService.getRequest(this.FEATURE_CONSTANTS.API.FEATURE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveFeature(user){
        return this.httpClientService.putRequest(this.FEATURE_CONSTANTS.API.FEATURE,user);
    }

    updateFeature(alias,user){
        return this.httpClientService.postRequest(this.FEATURE_CONSTANTS.API.FEATURE_ALIAS.replace(':alias',alias),user);
    }

    deleteFeature(alias){
        return this.httpClientService.deleteRequest(this.FEATURE_CONSTANTS.API.FEATURE_ALIAS.replace(':alias',alias)+"?isId=true&isHard=true",{});
    }

    featureLock(feature){
        return this.httpClientService.putRequest(this.FEATURE_CONSTANTS.API.FEATURE_LOCK.replace(':featureId',feature.id).replace(':status',feature.locked?'false':'true'),{});
    }


}