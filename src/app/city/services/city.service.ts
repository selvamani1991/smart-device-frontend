import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../shared/services/http-client.service';
import { CITY_CONSTANTS } from '../constants';

import { APP_CONFIG } from '../../constants';

@Injectable()
export class CityService {
    CITY_CONSTANTS=CITY_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.CITY_CONSTANTS=CITY_CONSTANTS;
    }
    getAllCities(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.CITY_CONSTANTS.API.CITY+data,{});
    }
    getCity(alias){
        return this.httpClientService.getRequest(this.CITY_CONSTANTS.API.CITY_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }
    getCityById(id){
        return this.httpClientService.getRequest(this.CITY_CONSTANTS.API.CITY_ALIAS.replace(':alias',id)+"?isId=true",{});
    }
    saveCity(city){
        return this.httpClientService.putRequest(this.CITY_CONSTANTS.API.CITY,city);
    }
     
    updateCity(city){
        return this.httpClientService.postRequest(this.CITY_CONSTANTS.API.CITY_ALIAS.replace(':alias',city.alias),city);
    }
     
    deleteCity(alias){
        return this.httpClientService.deleteRequest(this.CITY_CONSTANTS.API.CITY_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    uploadImage(files,cityId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('cityId',cityId);
        return this.httpClientService.uploadRequest(this.CITY_CONSTANTS.API.FILE_UPLOAD, formData);
    }

}
