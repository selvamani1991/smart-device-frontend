import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';
import { FEATURE_CATEGORY_CONSTANTS } from '../constants';

@Injectable()
export class FeatureCategoryService {
    FEATURE_CATEGORY_CONSTANTS=FEATURE_CATEGORY_CONSTANTS;

    constructor(private httpClientService:HttpClientService ) {
        this.FEATURE_CATEGORY_CONSTANTS=FEATURE_CATEGORY_CONSTANTS;
    }

    getAllFeatureCategory(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE_CATEGORY+data,{});
    }

    getAllFeature(page,pageSize){
          var data="?page="+page+"&pageSize="+pageSize;
          return this.httpClientService.getRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE+data,{});
    }

    getFeatureCategory(alias){
        return this.httpClientService.getRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE_CATEGORY_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveFeatureCategory(featureCategory){
        return this.httpClientService.putRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE_CATEGORY,featureCategory);
    }

    updateFeatureCategory(alias,featureCategory){
        return this.httpClientService.postRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE_CATEGORY_ALIAS.replace(':alias',alias),featureCategory);
    }

    deleteFeatureCategory(alias){
        return this.httpClientService.deleteRequest(this.FEATURE_CATEGORY_CONSTANTS.API.FEATURE_CATEGORY_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=true",{});
    }

}
