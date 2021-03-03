import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../../shared/services/http-client.service';

import { CONSUMER_TICKET_CONSTANTS } from '../constants';

@Injectable()
export class ConsumerTicketService {
    CONSUMER_TICKET_CONSTANTS=CONSUMER_TICKET_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.CONSUMER_TICKET_CONSTANTS=CONSUMER_TICKET_CONSTANTS;
    }

    getAllConsumerTickets(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        //var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET+data,{});
    }

    getConsumerTickets(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_CONSUMER_PRODUCT_ALIAS.replace(':alias',alias)+data,{});
    }

    getConsumerTicket(alias){
        return this.httpClientService.getRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    /*  getConsumerTickets(){
        return this.httpClientService.getRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET,{});
    } */

    getCities(){
        return this.httpClientService.getRequest(this.CONSUMER_TICKET_CONSTANTS.API.CITIES,{});
    }

    saveConsumerTicket(consumerTicket){
        return this.httpClientService.putRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET,consumerTicket);
    }

    updateConsumerTicket(consumerTicket){
        return this.httpClientService.postRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_ALIAS.replace(':alias',consumerTicket.alias),consumerTicket);
    }

    deleteConsumerTicket(alias){
        return this.httpClientService.deleteRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
        return this.httpClientService.postRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_STATUS,data);
    }

    uploadImage(files,consumerTicketId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('consumerTicketId',consumerTicketId);
        return this.httpClientService.uploadRequest(this.CONSUMER_TICKET_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    deleteProfilePicture(consumerTicket){
        return this.httpClientService.postRequest(this.CONSUMER_TICKET_CONSTANTS.API.CONSUMER_TICKET_ALIAS.replace(':alias', consumerTicket.alias),consumerTicket);
    }
}
