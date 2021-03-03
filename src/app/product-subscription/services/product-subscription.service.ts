import { Injectable } from '@angular/core';

import { HttpClientService } from '../../shared/services/http-client.service';

import { PRODUCT_SUBSCRIPTION_CONSTANTS } from '../constants';

    @Injectable()
    export class ProductSubscriptionService {
    PRODUCT_SUBSCRIPTION_CONSTANTS= PRODUCT_SUBSCRIPTION_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.PRODUCT_SUBSCRIPTION_CONSTANTS = PRODUCT_SUBSCRIPTION_CONSTANTS;
    }

    getAllProductSubscriptions(page, pageSize, query) {
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION + data, {});
    }

    getProductSubscription(alias) {
        return this.httpClientService.getRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    getProductSubscriptionById(id) {
         return this.httpClientService.getRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_ALIAS.replace(':alias', id) + '?isId=true', {});
    }

    getCities(){
        return this.httpClientService.getRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.CITIES, {});
    }

    saveProductSubscription(productSubscription) {
        return this.httpClientService.putRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION, productSubscription);
    }

    updateProductSubscription(productSubscription) {
        return this.httpClientService.postRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_ALIAS.replace(':alias', productSubscription.alias), productSubscription);
    }   

    deleteProductSubscription(alias) {
        return this.httpClientService.deleteRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=false', {});
    }

    changeStatus(data) {
        return this.httpClientService.postRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_STATUS, data);
    }

    updatePassword(productSubscription, alias) {
        return this.httpClientService.postRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.PRODUCT_SUBSCRIPTION_PASSWORD_ALIAS.replace(':alias', alias), productSubscription);
    }

    uploadImage(files, productSubscriptionId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('productSubscriptionId', productSubscriptionId);
        return this.httpClientService.uploadRequest(this.PRODUCT_SUBSCRIPTION_CONSTANTS.API.FILE_UPLOAD, formData);
    }

}
