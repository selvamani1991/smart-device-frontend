import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { MACHINE_CONSTANTS } from '../constants';

@Injectable()
export class MachineService {
    MACHINE_CONSTANTS=MACHINE_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.MACHINE_CONSTANTS=MACHINE_CONSTANTS;
    }

    getMachine(alias){
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.MACHINE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getMachines(){
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.MACHINE,{});
    }

    getProducts(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.PRODUCTS+data,{});
    }

    getCities(){
            return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.CITIES,{});
    }

    saveMachine(machine){
        return this.httpClientService.putRequest(this.MACHINE_CONSTANTS.API.MACHINE,machine);
    }

    updateMachine(machine){
        return this.httpClientService.postRequest(this.MACHINE_CONSTANTS.API.MACHINE_ALIAS.replace(':alias',machine.alias),machine);
    }

    deleteMachine(alias){
        return this.httpClientService.deleteRequest(this.MACHINE_CONSTANTS.API.MACHINE_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=true",{});
    }

    changeStatus(data){
       return this.httpClientService.postRequest(this.MACHINE_CONSTANTS.API.MACHINE_STATUS,data);
    }

    updatePassword(alias,machine){
        return this.httpClientService.postRequest(this.MACHINE_CONSTANTS.API.MACHINE_ALIAS.replace(':alias',alias),machine);
    }

    uploadImage(files,machineId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('machineId',machineId);
        return this.httpClientService.uploadRequest(this.MACHINE_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getMachineProductTypes(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&softDeleted=false"+"&query="+query;
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.MACHINE_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+data,{});
    }

    getMachineByMachineProductType(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.MACHINE_BY_MACHINE_PRODUCT_TYPE.replace(':alias',alias)+data,{});
    }

    getMachineProductType(alias){
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.MACHINE_PRODUCT_TYPE.replace(':alias',alias)+"?isId=false",{});
    }

    updateAssignMachine(machine){
        return this.httpClientService.postRequest(this.MACHINE_CONSTANTS.API.UPDATE_ASSIGN_MACHINE.replace(':alias',machine.alias),machine);
    }

    deleteProfilePicture(machine){
        return this.httpClientService.postRequest(this.MACHINE_CONSTANTS.API.MACHINE_ALIAS.replace(':alias', machine.alias),machine);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.MACHINE_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

}
