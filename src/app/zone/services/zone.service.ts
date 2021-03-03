import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ZONE_CONSTANTS } from '../constants';

    @Injectable()
    export class ZoneService {
        ZONE_CONSTANTS=ZONE_CONSTANTS;
        constructor(private httpClientService:HttpClientService ) {
            this.ZONE_CONSTANTS=ZONE_CONSTANTS;
    }

    getAllZones(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false"+"&query="+query;
        return this.httpClientService.getRequest(this.ZONE_CONSTANTS.API.ZONE+data,{});
    }

    getZone(alias){
        return this.httpClientService.getRequest(this.ZONE_CONSTANTS.API.ZONE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getZoneById(id){
         return this.httpClientService.getRequest(this.ZONE_CONSTANTS.API.ZONE_ALIAS.replace(':alias',id)+"?isId=true",{});
    }

    getCities(page,pageSize,query){
        var data="?search=true&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.ZONE_CONSTANTS.API.CITIES+data,{});
    }

    saveZone(zone){
        return this.httpClientService.putRequest(this.ZONE_CONSTANTS.API.ZONE,zone);
    }

    updateZone(zone){
        return this.httpClientService.postRequest(this.ZONE_CONSTANTS.API.ZONE_ALIAS.replace(':alias',zone.alias),zone);
    }   

    deleteZone(alias,zone){
        return this.httpClientService.deleteRequest(this.ZONE_CONSTANTS.API.ZONE_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
        return this.httpClientService.postRequest(this.ZONE_CONSTANTS.API.ZONE_STATUS,data);
    }

    updatePassword(zone,alias){
        return this.httpClientService.postRequest(this.ZONE_CONSTANTS.API.ZONE_PASSWORD_ALIAS.replace(':alias',alias),zone);
    }

    uploadImage(files,zoneId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('zoneId',zoneId);
        return this.httpClientService.uploadRequest(this.ZONE_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    deleteProfilePicture(zone){
        return this.httpClientService.postRequest(this.ZONE_CONSTANTS.API.ZONE_ALIAS.replace(':alias', zone.alias),zone);
    }
}
