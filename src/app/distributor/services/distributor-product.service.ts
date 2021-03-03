import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { DISTRIBUTOR_CONSTANTS } from '../constants';

@Injectable()
export class DistributorProductService {
    DISTRIBUTOR_CONSTANTS=DISTRIBUTOR_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.DISTRIBUTOR_CONSTANTS=DISTRIBUTOR_CONSTANTS;
    }

    getAllDistributorProducts(page,pageSize,query){
        var data="&owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=dispatchedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_PRODUCT+data,{});
    }

    getAllDistributorProductLists(page,pageSize, query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=dispatchedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.ALL_DISTRIBUTOR_PRODUCT+data,{});
    }

    getAllCompanies(){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.COMPANY+"?owner=true",{});
    }

    getProducts(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.PRODUCTS+data,{});
    }

    getCompanies(pageSize){
        var data="?owner=true&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.COMPANIES+data,{});
    }

    saveCompanyProduct(companyProduct){
        return this.httpClientService.putRequest(this.DISTRIBUTOR_CONSTANTS.API.COMPANY_PRODUCT,companyProduct);
    }

    getDistributorProduct(page,pageSize,query){
        var data="&owner=true&page="+page+"&query="+query+"&pageSize="+pageSize+"&order=desc&orderField=dispatchedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_PRODUCTS+data,{});
    }

    updateDistributorProduct(distributorProduct){
        return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.PRODUCT_STATUS.replace(':alias',distributorProduct.alias),distributorProduct);
    }

    getAllAssignedCompanyProducts(page,pageSize,query){
        var data="?createdBy=true&page="+page+"&query="+query+"&pageSize="+pageSize+"&order=desc&orderField=dispatchedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.ASSIGNED_COMPANY_PRODUCT+data,{});
    }

    getInvoice(alias){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.PRODUCT_INVOICE.replace(':alias',alias)+"?owner=true",{});
    }
}
