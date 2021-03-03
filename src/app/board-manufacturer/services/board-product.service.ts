import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { BOARD_MANUFACTURER_CONSTANTS } from '../constants';

@Injectable()
export class BoardProductService {
    BOARD_MANUFACTURER_CONSTANTS=BOARD_MANUFACTURER_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.BOARD_MANUFACTURER_CONSTANTS=BOARD_MANUFACTURER_CONSTANTS;
    }

    getManufacturers(page,pageSize){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.MANUFACTURERS,{});
    }

    saveManufacturerProduct(manufacturerProduct){
        return this.httpClientService.putRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.MANUFACTURER_PRODUCT,manufacturerProduct);
    }

    getAllBoardProductTypes(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=assignedDate&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_PRODUCT_TYPE+data,{});
    }

    updateBoardProductType(boardProductType){
        return this.httpClientService.postRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_PRODUCT_TYPE_STATUS.replace(':alias',boardProductType.alias),boardProductType);
    }

    getBoardProductType(alias){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

}
