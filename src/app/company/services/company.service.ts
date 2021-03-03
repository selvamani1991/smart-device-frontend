import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { COMPANY_CONSTANTS } from '../constants';

@Injectable()
export class CompanyService {
    COMPANY_CONSTANTS= COMPANY_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.COMPANY_CONSTANTS = COMPANY_CONSTANTS;
    }

    getAllCompanys(page, pageSize, query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY + data, {});
    }

    getCompany(alias){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    getCompanys(){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY, {});
    }

    getCompanyBuilding(page, pageSize){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_BUILDING, {});
    }

    saveCompany(company){
        return this.httpClientService.putRequest(this.COMPANY_CONSTANTS.API.COMPANY, company);
    }

    updateCompany(company){
        return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.COMPANY_ALIAS.replace(':alias', company.alias), company);
    }

    deleteCompany(alias){
        return this.httpClientService.deleteRequest(this.COMPANY_CONSTANTS.API.COMPANY_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=false', {});
    }

    changeStatus(data){
        return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.COMPANY_STATUS, data);
    }

    getCompanyProducts(page, pageSize){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_PRODUCT + data, {});
    }

    getAllCompanyProducts(page, pageSize){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize;
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_PRODUCT + data, {});
    }

    updateCompanyProduct(companyProduct){
        return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.PRODUCT_STATUS.replace(':alias', companyProduct.alias), companyProduct);
    }

    getCompanyProduct(page, pageSize, query){
        var data = '&owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_PRODUCTS + data, {});
    }

    uploadImage(files, companyId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('companyId', companyId);
        return this.httpClientService.uploadRequest(this.COMPANY_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(company, alias){
         return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.COMPANY_PASSWORD_ALIAS.replace(':alias', alias), company);
    }

    getZones(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.ZONES, {});
    }

    getCompanySubscription(page, pageSize, alias,query){
        var data="?active=false&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_SUBSCRIPTION_LIST.replace(':alias', alias) + data, {});
    }

    saveCompanySubscription(companySubscription){
        return this.httpClientService.putRequest(this.COMPANY_CONSTANTS.API.COMPANY_SUBSCRIPTION, companySubscription);
    }

    getCompanySubscriptions(alias){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.COMPANY_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    updateCompanySubscription(companySubscription){
            return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.COMPANY_SUBSCRIPTION_ALIAS.replace(':alias', companySubscription.alias), companySubscription);
    }

    getCities(page, pageSize, query){
        var data = '?search=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.CITIES + data, {});
    }

    deleteProfilePicture(company){
        return this.httpClientService.postRequest(this.COMPANY_CONSTANTS.API.COMPANY_ALIAS.replace(':alias', company.alias),company);
    }

    getCompanyZones(ownerId) {
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.ZONES_OWNER_ID.replace(':ownerId', ownerId),{});
    }

    getCurrentVendorDetail(){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.CURRENT_VENDOR,{});
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    getSubscription() {
        return this.httpClientService.getRequest(this.COMPANY_CONSTANTS.API.CLIENT_MODAL_SUBSCRIPTION, {});
    }
}
