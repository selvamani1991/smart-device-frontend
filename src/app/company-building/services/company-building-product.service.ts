import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { COMPANY_BUILDING_CONSTANTS } from '../constants';

@Injectable()
export class CompanyBuildingProductService {
    COMPANY_BUILDING_CONSTANTS= COMPANY_BUILDING_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
    }

    getAllCompanyBuildingProducts(page, pageSize, query){
        var data = '&owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT + data, {});
    }

    getAllCompanyBuildingProductLists(page, pageSize,query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query +'&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.ALL_COMPANY_BUILDING_PRODUCT + data, {});
    }

    getCompanyBuildingProducts(page, pageSize){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT + data, {});
    }

    getCompanyBuildings(page, pageSize){
        return this.httpClientService.getRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING, {});
    }

    updateCompanyBuildingProduct(companyBuildingProduct){
        return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT_STATUS.replace(':alias', companyBuildingProduct.alias), companyBuildingProduct);
    }

    saveCompanyBuildingProduct(companyBuildingProduct){
         return this.httpClientService.putRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT, companyBuildingProduct);
    }

    updateCompanyProduct(companyBuildingProduct){
         return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT_STATUS.replace(':alias', companyBuildingProduct.alias), companyBuildingProduct);
    }

    rejectCompanyBuildingProduct(companyBuildingProduct){
        return this.httpClientService.postRequest(this.COMPANY_BUILDING_CONSTANTS.API.COMPANY_BUILDING_PRODUCT_REJECT.replace(':alias',companyBuildingProduct.alias),companyBuildingProduct);
    }

}
