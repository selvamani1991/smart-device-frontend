import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { CLIENT_CONSTANTS } from '../constants';

    @Injectable()
    export class ClientService {
        CLIENT_CONSTANTS=CLIENT_CONSTANTS;
        constructor(private httpClientService:HttpClientService ) {
            this.CLIENT_CONSTANTS=CLIENT_CONSTANTS;
    }

    getAllClients(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&softDeleted=false"+"&query="+query;
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT+data,{});
    }

    getAllManufacturers(){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.MANUFACTURERS+"?owner=true",{});
    }

    getAllBoardManufacturers(){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.BOARD_MANUFACTURERS+"?owner=true",{});
    }

    getProductTypes(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize;
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getMachines(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize;
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.MACHINES+data,{});
    }

    saveBoardManufacturer(boardManufacturer){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.BOARD_MANUFACTURERS,boardManufacturer);
    }

    saveMachine(machine){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.MACHINES,machine);
    }

    getClient(alias){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getClientById(id){
         return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_ALIAS.replace(':alias',id)+"?isId=true",{});
    }

    getCities(page,pageSize,query){
        var data="?search=true&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CITIES+data,{});
    }

    saveClient(client){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.CLIENT,client);
    }

    updateClient(client){
        return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_ALIAS.replace(':alias',client.alias),client);
    }   

    deleteClient(alias,client){
        return this.httpClientService.deleteRequest(this.CLIENT_CONSTANTS.API.CLIENT_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
            return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_SUBSCRIPTION_STATUS,data);
        return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_STATUS,data);
    }

    changeClientSubscriptionStatus(data){
    }

    getAllProductTypes(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getProductType(alias){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    saveBoardProductType(boardProductType){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.BOARD_PRODUCT_TYPE,boardProductType);
    }

    saveMachineProductType(machineProductType){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.MACHINE_PRODUCT_TYPE,machineProductType);
    }

    updatePassword(client,alias){
        return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_PASSWORD_ALIAS.replace(':alias',alias),client);
    }

    getAllProducts(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT+data,{});
    }

    getClientSubscriptions(alias){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_SUBSCRIPTION_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    updateClientSubscription(clientSubscription){
        return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_SUBSCRIPTION_ALIAS.replace(':alias',clientSubscription.alias),clientSubscription);
    }

    saveClientSubscription(clientSubscription){
        return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.CLIENT_SUBSCRIPTION,clientSubscription);
    }

    getClientSubscription(page,pageSize,alias,query){
        var data="?active=false&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_SUBSCRIPTION_LIST.replace(':alias',alias)+data,{});
    }

    deleteProfilePicture(client){
        return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.CLIENT_ALIAS.replace(':alias', client.alias),client);
    }

    getClients(ownerId){
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENTS.replace(':alias',ownerId)+"?isId=false",{});
    }

    getSubscription() {
        return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_MODAL_SUBSCRIPTION, {});
    }

}
