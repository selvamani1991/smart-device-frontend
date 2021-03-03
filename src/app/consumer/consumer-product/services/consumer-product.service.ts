import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';

import { CONSUMER_PRODUCT_CONSTANTS } from '../constants';

@Injectable()
export class ConsumerProductService {
    CONSUMER_PRODUCT_CONSTANTS=CONSUMER_PRODUCT_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.CONSUMER_PRODUCT_CONSTANTS=CONSUMER_PRODUCT_CONSTANTS;
    }

    getAllConsumerProducts(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false"+"&order=desc&orderField=manufacturingDate";
        return this.httpClientService.getRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT_CONSUMER_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+data,{});
    }

    getConsumerProduct(alias){
        return this.httpClientService.getRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveConsumerProduct(consumerProduct){
        return this.httpClientService.putRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT,consumerProduct);
    }

    updateConsumerProduct(consumerProduct){
        return this.httpClientService.postRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT_ALIAS.replace(':alias',consumerProduct.alias),consumerProduct);
    }

    deleteConsumerProduct(alias){
        return this.httpClientService.deleteRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=true",{});
    }

    uploadImage(files,consumerProductId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('consumerProductId',consumerProductId);
        return this.httpClientService.uploadRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    deleteProfilePicture(consumerProduct){
        return this.httpClientService.postRequest(this.CONSUMER_PRODUCT_CONSTANTS.API.CONSUMER_PRODUCT_ALIAS.replace(':alias', consumerProduct.alias),consumerProduct);
    }
}