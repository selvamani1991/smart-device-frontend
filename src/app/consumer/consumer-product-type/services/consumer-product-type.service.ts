import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';

import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from '../constants';

@Injectable()
export class ConsumerProductTypeService {
    CONSUMER_PRODUCT_TYPE_CONSTANTS=CONSUMER_PRODUCT_TYPE_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.CONSUMER_PRODUCT_TYPE_CONSTANTS=CONSUMER_PRODUCT_TYPE_CONSTANTS;
    }

    getAllConsumerProductTypes(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE+data,{});
    }

    getConsumerProductType(alias){
        return this.httpClientService.getRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveConsumerProductType(consumerProductType){
        return this.httpClientService.putRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE,consumerProductType);
    }

    updateConsumerProductType(consumerProductType){
        return this.httpClientService.postRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE_ALIAS.replace(':alias',consumerProductType.alias),consumerProductType);
    }

    deleteConsumerProductType(alias){
        return this.httpClientService.deleteRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=true",{});
    }

    uploadImage(files,consumerProductTypeId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('consumerProductTypeId',consumerProductTypeId);
        return this.httpClientService.uploadRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    deleteProfilePicture(consumerProductType){
        return this.httpClientService.postRequest(this.CONSUMER_PRODUCT_TYPE_CONSTANTS.API.CONSUMER_PRODUCT_TYPE_ALIAS.replace(':alias', consumerProductType.alias),consumerProductType);
    }
}
