import { Injectable } from '@angular/core';

import { HttpClientService } from '../../shared/services/http-client.service';

import { CONSUMER_SUBSCRIPTION_CONSTANTS } from '../constants';

    @Injectable()
    export class ConsumerSubscriptionService {
        CONSUMER_SUBSCRIPTION_CONSTANTS= CONSUMER_SUBSCRIPTION_CONSTANTS;
        constructor(private httpClientService: HttpClientService ) {
        this.CONSUMER_SUBSCRIPTION_CONSTANTS = CONSUMER_SUBSCRIPTION_CONSTANTS;
    }

    getAllConsumerSubscriptions(page, pageSize, query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION + data, {});
    }

    getConsumerSubscription(alias) {
        return this.httpClientService.getRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    saveConsumerSubscription(consumerSubscription) {
        return this.httpClientService.putRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION, consumerSubscription);
    }

    updateConsumerSubscription(consumerSubscription) {
        return this.httpClientService.postRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION_ALIAS.replace(':alias', consumerSubscription.alias), consumerSubscription);
    }

    deleteConsumerSubscription(alias) {
        return this.httpClientService.deleteRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=false', {});
    }

    deleteProfilePicture(consumerSubscription){
        return this.httpClientService.postRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.CONSUMER_SUBSCRIPTION_ALIAS.replace(':alias', consumerSubscription.alias),consumerSubscription);
    }

    uploadImage(files,distributorId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('distributorId',distributorId);
        return this.httpClientService.uploadRequest(this.CONSUMER_SUBSCRIPTION_CONSTANTS.API.FILE_UPLOAD, formData);
    }
}
