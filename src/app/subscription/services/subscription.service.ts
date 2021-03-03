import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { SUBSCRIPTION_CONSTANTS } from '../constants';


@Injectable()
export class SubscriptionService {
    SUBSCRIPTION_CONSTANTS= SUBSCRIPTION_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.SUBSCRIPTION_CONSTANTS = SUBSCRIPTION_CONSTANTS;
    }

    getAllSubscriptions(page, pageSize, query) {
         var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION + data, {});
    }

    getSubscription(alias) {
        return this.httpClientService.getRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    saveSubscription(subscription) {
        return this.httpClientService.putRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION, subscription);
    }

    updateSubscription(subscription) {
        return this.httpClientService.postRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION_ALIAS.replace(':alias', subscription.alias), subscription);
    }

    deleteSubscription(alias) {
        return this.httpClientService.deleteRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=true', {});
    }

    changeStatus(data) {
       return this.httpClientService.postRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION_STATUS, data);
    }

    uploadImage(files, subscriptionId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('subscriptionId', subscriptionId);
        return this.httpClientService.uploadRequest(this.SUBSCRIPTION_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getSubscriptions(alias) {
        var data="?owner=true";
        return this.httpClientService.getRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTIONS.replace(':alias', alias) + '?owner=true', {});
    }

    getCurrency() {
        return this.httpClientService.getRequest(this.SUBSCRIPTION_CONSTANTS.API.CURRENCY, {});
    }

    getProductCategory() {
        return this.httpClientService.getRequest(this.SUBSCRIPTION_CONSTANTS.API.PRODUCT_CATEGORIES, {});
    }

    deleteProfilePicture(subscription){
        return this.httpClientService.postRequest(this.SUBSCRIPTION_CONSTANTS.API.SUBSCRIPTION_ALIAS.replace(':alias', subscription.alias), subscription);
    }

}
