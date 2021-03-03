import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';
import { ROLE_CONSTANTS } from '../constants';

@Injectable()
export class RoleService {
    ROLE_CONSTANTS=ROLE_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.ROLE_CONSTANTS=ROLE_CONSTANTS;
    }

    getAllRole(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.ROLE_CONSTANTS.API.ROLE+data,{});
    }

    getRole(alias){
        return this.httpClientService.getRequest(this.ROLE_CONSTANTS.API.ROLE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveRole(user){
        return this.httpClientService.putRequest(this.ROLE_CONSTANTS.API.ROLE,user);
    }

    updateRole(alias,user){
        return this.httpClientService.postRequest(this.ROLE_CONSTANTS.API.ROLE_ALIAS.replace(':alias',alias),user);
    }

    deleteRole(alias){
        return this.httpClientService.deleteRequest(this.ROLE_CONSTANTS.API.ROLE_ALIAS.replace(':alias',alias)+"?isId=true&isHard=true",{});
    }

    features(alias){
        return this.httpClientService.getRequest(this.ROLE_CONSTANTS.API.FEATURES.replace(':alias',alias),{});
    }

    featureCategories(){
        return this.httpClientService.getRequest(this.ROLE_CONSTANTS.API.FEATURE_CATEGORIES,{});
    }

    updatePermission(data){
        return this.httpClientService.postRequest(this.ROLE_CONSTANTS.API.UPDATE_PERMISSION,data);
    }

    search(query,page,pageSize){
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.getRequest(this.ROLE_CONSTANTS.API.SEARCH_ROLE.replace(':query',query)+data,{});
    }
}
