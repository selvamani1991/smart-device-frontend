import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { COMPANY_CONSTANTS } from '../constants';

@Injectable()
export class CompanyProductService {
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
    }

    getAllCompanyProducts(page, pageSize, query){
       var data = '&owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
       return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_PRODUCT + data, {});
    }

    getAllCompanyProductLists(page, pageSize, query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.ALL_COMPANY_PRODUCT + data, {});
    }

    getAllCompanyBuildings(){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_BUILDING + '?owner=true', {});
    }

    getCompanyProducts(page, pageSize){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_PRODUCT + data, {});
    }

    getCompanyBuildings(pageSize){
        var data = '?owner=true&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_BUILDINGS + data, {});
    }

    saveCompanyBuildingProduct(companyBuildingProduct){
        return this.httpClientService.putRequest(this.COMPANY_CONSTANTS.API.COMPANY_BUILDING_PRODUCT, companyBuildingProduct);
    }

    getAllAssignedCompanyBuildingProducts(page, pageSize, query){
        var data = '?createdBy=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.ASSIGNED_COMPANY_BUILDING_PRODUCT + data, {});
    }

    getCompanyBuildingProduct(){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_BUILDING_PRODUCT, {});
    }

}

