import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { PRODUCT_WIZARD_CONSTANTS } from '../constants';

@Injectable()
export class ProductWizardService {
    PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.PRODUCT_WIZARD_CONSTANTS=PRODUCT_WIZARD_CONSTANTS;
    }

    getCompanies(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.COMPANIES+data,{});
    }

    getVendors(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.VENDORS+data,{});
    }

    getWizardProductTypes(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getWizardBoardManufacturers(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.BOARD_MANUFACTURERS+data,{});
    }

    getWizardMachineManufacturers(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.MACHINE_MANUFACTURERS+data,{});
    }

    getClientSubscriptions(){
        var data="?active=true";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.CLIENT_SUBSCRIPTION_ALIAS+data,{});
    }

    saveProductOrder(orderWizard) {
        return this.httpClientService.putRequest(this.PRODUCT_WIZARD_CONSTANTS.API.ORDER_WIZARD, orderWizard);
    }

    getAllOrderWizard(page, pageSize,query) {
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=manufacturerDate&softDeleted=false";
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.ORDER_WIZARD + data, {});
    }

    getOrderWizard(alias) {
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.ORDER_WIZARD_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    updateOrderWizard(orderWizard) {
        return this.httpClientService.postRequest(this.PRODUCT_WIZARD_CONSTANTS.API.ORDER_WIZARD_ALIAS.replace(':alias', orderWizard.alias), orderWizard);
    }

    updateProducts(alias,subscriptionId){
        return this.httpClientService.postRequest(this.PRODUCT_WIZARD_CONSTANTS.API.ACCEPT_PRODUCT.replace(':alias',alias).replace(':subscriptionId',subscriptionId),{});
    }

    getInvoiceData(alias){
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.INVOICE_DATA.replace(':alias',alias),{});
    }

    getBoards(alias){
        var data="?owner=true";
       return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.BOARD_LIST.replace(':alias',alias)+data,{});
    }

    getMachines(alias){
        var data="?owner=true";
       return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.MACHINE_LIST.replace(':alias',alias)+data,{});
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.PRODUCT_WIZARD_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }
}
