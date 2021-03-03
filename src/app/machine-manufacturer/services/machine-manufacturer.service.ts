import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { MACHINE_MANUFACTURER_CONSTANTS } from '../constants';

@Injectable()
export class MachineManufacturerService {
    MACHINE_MANUFACTURER_CONSTANTS=MACHINE_MANUFACTURER_CONSTANTS;
    manufacturers=[];
    constructor(private httpClientService:HttpClientService ) {
    }

    getAllManufacturers(page,pageSize,query){
       var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
       return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER+data,{});
    }

    saveManufacturer(manufacturer){
        return this.httpClientService.putRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER,manufacturer);
    }

    saveManufacturerProduct(manufacturer){
        return this.httpClientService.putRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_PRODUCT,manufacturer);
    }

    getManufacturer(alias){
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    deleteManufacturer(alias){
       return this.httpClientService.deleteRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    getAllClients(){
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.CLIENT,{});
    }

    getAllProducts(){
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.PRODUCT,{});
    }

    updateManufacturer(manufacturer){
        return this.httpClientService.postRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_ALIAS.replace(':alias',manufacturer.alias),manufacturer);
    }

    uploadImage(files,manufacturerId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('manufacturerId',manufacturerId);
        return this.httpClientService.uploadRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(manufacturer,alias){
        return this.httpClientService.postRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_PASSWORD_ALIAS.replace(':alias',alias),manufacturer);
    }

    getAllMachines(page,pageSize,query){
        var data="?createdBy=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MACHINE+data,{});
    }

    getCities(page,pageSize,query){
        var data="?search=true&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.CITIES+data,{});
    }

    deleteProfilePicture(manufacturer){
        return this.httpClientService.postRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.MANUFACTURER_ALIAS.replace(':alias', manufacturer.alias),manufacturer);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.MACHINE_MANUFACTURER_CONSTANTS.API.CLIENTS.replace(':alias',ownerId)+"?isId=false",{});
    }
}
