import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { CLIENT_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

    @Injectable()
    export class ClientProductService {
        CLIENT_CONSTANTS=CLIENT_CONSTANTS;
        CONFIG=APP_CONFIG;
        contextUrl='';
        clientProducts=[];
        constructor(private httpClientService:HttpClientService ) {
        }

        getAllClientProducts(page,pageSize){
           var data="?page="+page+"&pageSize="+pageSize;
           return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.CLIENT_PRODUCT+data,{});
        }

        getAllCompanies(){
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.COMPANIES+"?owner=true",{});
        }

        getAllVendors(){
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.VENDORS+"?owner=true",{});
        }

        updateClientProduct(clientProduct){
            return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.PRODUCT_STATUS.replace(':alias',clientProduct.alias),clientProduct);
        }

        updateBoardProductType(boardProductType){
            return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.BOARD_PRODUCT_TYPE_STATUS.replace(':alias',boardProductType.alias),boardProductType);
        }

        updateMachineProductType(machineProductType){
            return this.httpClientService.postRequest(this.CLIENT_CONSTANTS.API.MACHINE_PRODUCT_TYPE_STATUS.replace(':alias',machineProductType.alias),machineProductType);
        }

        getCompanies(pageSize){
            var data="?owner=true&pageSize="+pageSize+"&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.COMPANY+data,{});
        }

        saveCompanyProduct(companyProduct){
            return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.COMPANY_PRODUCT,companyProduct);
        }

        getVendors(pageSize){
            var data="?owner=true&pageSize="+pageSize+"&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.VENDOR+data,{});
        }

        saveVendorProduct(companyProduct){
            return this.httpClientService.putRequest(this.CLIENT_CONSTANTS.API.VENDOR_PRODUCT,companyProduct);
        }

        getProducts(page,pageSize){
            var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCTS+data,{});
        }

        getAllProductTypes(page,pageSize){
            var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT_TYPES+data,{});
        }

        getAllBoardProductTypes(page,pageSize){
            var data="?page="+page+"&pageSize="+pageSize+"&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.BOARD_PRODUCT_TYPE+data,{});
        }

        getBoardProductType(alias){
             return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.BOARD_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
        }

        getAllMachineProductTypes(page,pageSize,query){
            var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=assignedDate&softDeleted=false";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.MACHINE_PRODUCT_TYPE+data,{});
        }

        getAllMachineProductType(alias){
             return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.MACHINE_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
        }

        getBoardManufacturers(){
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.BOARD_MANUFACTURER,{});
        }

        getAllAssignedVendorProducts(page,pageSize,query){
            var data="?createdBy=true&page="+page+"&query="+query+"&pageSize="+pageSize+"&order=desc&orderField=dispatchedDate";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.ASSIGNED_VENDOR_PRODUCT+data,{});
        }

        getAllAssignedCompanyProducts(page,pageSize,query){
            var data="?createdBy=true&page="+page+"&query="+query+"&pageSize="+pageSize+"&order=desc&orderField=dispatchedDate";
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.ASSIGNED_COMPANY_PRODUCT+data,{});
        }

        uploadImage(files,clientId){
            const formData = new FormData();
            formData.append('file', files);
            formData.append('clientId',clientId);
            return this.httpClientService.uploadRequest(this.CLIENT_CONSTANTS.API.FILE_UPLOAD, formData);
        }

        getInvoice(alias){
            return this.httpClientService.getRequest(this.CLIENT_CONSTANTS.API.PRODUCT_INVOICE.replace(':alias',alias)+"?owner=true",{});
        }

    }