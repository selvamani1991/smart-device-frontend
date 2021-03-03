import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../shared/services/http-client.service';

import { CONSUMER_CONSTANTS } from '../constants';

@Injectable()
export class ConsumerService {
    CONSUMER_CONSTANTS= CONSUMER_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.CONSUMER_CONSTANTS = CONSUMER_CONSTANTS;
    }

    getAllConsumers(page, pageSize, query) {
        let data = '&page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.CONSUMER_CONSTANTS.API.CONSUMER + data, {});
    }

    getConsumerSubscription(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CONSUMER_CONSTANTS.API.CONSUMER_SUBSCRIPTION_LIST.replace(':alias',alias)+data,{});
    }

    getConsumerDevice(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CONSUMER_CONSTANTS.API.CONSUMER_DEVICE_LIST.replace(':alias',alias)+data,{});
    }

    saveConsumerSubscription(consumerSubscription) {
        return this.httpClientService.putRequest(this.CONSUMER_CONSTANTS.API.CONSUMER_SUBSCRIPTION, consumerSubscription);
    }



}
