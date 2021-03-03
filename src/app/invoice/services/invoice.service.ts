import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { INVOICE_CONSTANTS } from '../constants';

    @Injectable()
    export class InvoiceService {
        INVOICE_CONSTANTS=INVOICE_CONSTANTS;
        constructor(private httpClientService:HttpClientService ) {
            this.INVOICE_CONSTANTS=INVOICE_CONSTANTS;
    }

    getInvoiceData(alias){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.INVOICE_DATA.replace(':alias',alias),{});
    }

    updateInvoiceProduct(invoice,alias){
        return this.httpClientService.postRequest(this.INVOICE_CONSTANTS.API.PRODUCT_STATUS.replace(':alias',alias),invoice);
    }

    getVendorProduct(page,pageSize,query){
        var data="&owner=true&page="+page+"&query="+query+"&pageSize="+pageSize+"&order=desc&orderField=dispatchedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.VENDOR_PRODUCTS+data,{});
    }

    getAllCompanys(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.COMPANY+data,{});
    }

    getCities(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.CITIES,{});
    }

    getCompanys(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.COMPANYS,{});
    }

    getClients(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.CLIENTS,{});
    }

    getVendor(alias){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.VENDOR_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getVendors(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.VENDORS,{});
    }

    getDistributors(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.DISTRIBUTORS,{});
    }

    getCompanyBuildings(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.COMPANY_BUILDINGS,{});
    }

    getMachines(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.MACHINES,{});
    }

    getProductTypes(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.PRODUCT_TYPES,{});
    }

    getZones(){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.ZONES,{});
    }

    getClient(alias){
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.CLIENT_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getCurrentSubscriptions(){
        var data="?active=true";
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.CURRENT_SUBSCRIPTIONS+data,{});
    }

    updateProduct(alias,subscriptionId){
        return this.httpClientService.postRequest(this.INVOICE_CONSTANTS.API.ACCEPT_PRODUCT.replace(':alias',alias).replace(':subscriptionId',subscriptionId),{});
    }

    rejectCompanyProduct(companyProduct){
        return this.httpClientService.postRequest(this.INVOICE_CONSTANTS.API.COMPANY_ALIAS.replace(':alias',companyProduct.alias),companyProduct);
    }

    rejectInvoiceProduct(invoice,alias){
        return this.httpClientService.postRequest(this.INVOICE_CONSTANTS.API.PRODUCT_STATUS.replace(':alias',alias),invoice);
    }

    getAllClient(ownerId) {
        return this.httpClientService.getRequest(this.INVOICE_CONSTANTS.API.ALL_CLIENT.replace(':alias', ownerId) + '?isId=false', {});
    }
}
