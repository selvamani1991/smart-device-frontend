  import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { DISTRIBUTOR_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

@Injectable()
export class DistributorService {
    DISTRIBUTOR_CONSTANTS=DISTRIBUTOR_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.DISTRIBUTOR_CONSTANTS=DISTRIBUTOR_CONSTANTS;
    }

    getAllDistributors(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR+data,{});
    }

    getDistributor(alias){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getDistributors(){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR,{});
    }

    getCities(page,pageSize,query){
        var data="?search=true&page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.CITIES+data,{});
    }

    saveDistributor(distributor){
        return this.httpClientService.putRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR,distributor);
    }

    updateDistributor(distributor){
        return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_ALIAS.replace(':alias',distributor.alias),distributor);
    }

    deleteDistributor(alias){
        return this.httpClientService.deleteRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
       return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_STATUS,data);
       return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTION_STATUS,data);
    }

    uploadImage(files,distributorId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('distributorId',distributorId);
        return this.httpClientService.uploadRequest(this.DISTRIBUTOR_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(distributor,alias){
        return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_PASSWORD_ALIAS.replace(':alias',alias),distributor);
    }

    saveDistributorSubscription(distributorSubscription){
        return this.httpClientService.putRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTION,distributorSubscription);
    }

    getDistributorSubscription(page,pageSize,alias,query){
         var data="?active=false&page="+page+"&pageSize="+pageSize+"&query="+query;
         return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTION_LIST.replace(':alias',alias)+data,{});
    }

    getDistributorSubscriptions(alias){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTION_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    updateDistributorSubscription(distributorSubscription){
        return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTION_ALIAS.replace(':alias',distributorSubscription.alias),distributorSubscription);

    }

    deleteProfilePicture(distributor){
        return this.httpClientService.postRequest(this.DISTRIBUTOR_CONSTANTS.API.DISTRIBUTOR_ALIAS.replace(':alias', distributor.alias),distributor);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    getSubscription() {
        return this.httpClientService.getRequest(this.DISTRIBUTOR_CONSTANTS.API.CLIENT_MODAL_SUBSCRIPTION, {});
    }


}
