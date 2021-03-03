import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { COMPANY_BUILDING_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

@Injectable()
export class CompanyBuildingService {
        COMPANY_BUILDING_CONSTANTS=COMPANY_BUILDING_CONSTANTS;
        constructor(private httpClientService:HttpClientService ) {
        this.COMPANY_BUILDING_CONSTANTS=COMPANY_BUILDING_CONSTANTS;
    }

    getAllCompanyBuildings(page,pageSize,query){
        var data='?owner=true&page='+page+'&pageSize='+pageSize+'&query='+query+'&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING+data,{});
    }

    getCompanyBuilding(alias) {
         return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_ALIAS.replace(':alias',alias)+'?isId=false',{});
    }

    getCompanyBuildingById(id) {
         return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_ALIAS.replace(':alias',id)+'?isId=true',{});
    }

    saveCompanyBuilding(companyBuilding) {
        return this.httpClientService.putRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING,companyBuilding);
    }

    updateCompanyBuilding(companyBuilding) {
         return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_ALIAS.replace(':alias',companyBuilding.alias),companyBuilding);
    }

    deleteCompanyBuilding(alias) {
        return this.httpClientService.deleteRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_ALIAS.replace(':alias',alias)+'?isId=false&isSoft=false',{});
    }

    changeStatus(data) {
       return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_STATUS,data);
    }

    getCompanyBuildingProduct(page,pageSize,query){
        var data='&owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCTS+data,{});
    }

    uploadImage(files,companyBuildingId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('companyBuildingId',companyBuildingId);
        return this.httpClientService.uploadRequest(this.COMPANY_BUILDING_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(companyBuilding,alias){
        return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PASSWORD_ALIAS.replace(':alias',alias),companyBuilding);
    }

    getCities(page,pageSize,query){
        var data = '?search=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.CITIES+ data, {});
    }

    deleteProfilePicture(companyBuilding){
        return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_ALIAS.replace(':alias', companyBuilding.alias),companyBuilding);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }
}
