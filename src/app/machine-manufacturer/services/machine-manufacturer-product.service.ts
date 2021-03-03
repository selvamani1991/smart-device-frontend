import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../constants';

@Injectable()
export class MachineManufacturerProductService {
    MACHINE_MANUFACTURER_CONSTANTS=MACHINE_MANUFACTURER_CONSTANTS;
    manufacturerProducts=[];
    constructor(private httpClientService:HttpClientService ) {
    }

    getAllManufacturerProducts(page,pageSize){
       var data="?owner=true&page="+page+"&pageSize="+pageSize;
       return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_PRODUCT+data,{});
    }

    getManufacturerProducts(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_PRODUCT+data,{});
    }

    getClients(page,pageSize){
           return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.CLIENT,{});
    }

    saveClientProduct(clientProduct){
        return this.httpClientService.putRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.CLIENT_PRODUCT,clientProduct);
    }

    updateManufacturerProduct(manufacturerProduct){
        return this.httpClientService.postRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.PRODUCT_STATUS.replace(':alias',manufacturerProduct.alias),manufacturerProduct);
    }
}