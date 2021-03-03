import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { MEDIA_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

@Injectable()
export class MediaService {
    MEDIA_CONSTANTS=MEDIA_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.MEDIA_CONSTANTS=MEDIA_CONSTANTS;
    }

    getAllMedias(page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.MEDIA+data,{});
    }

    getMedia(alias){
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.MEDIA_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }
    
    saveMedia(media){
        return this.httpClientService.putRequest(this.MEDIA_CONSTANTS.API.MEDIA,media);
    }

    updateMedia(media){
        return this.httpClientService.postRequest(this.MEDIA_CONSTANTS.API.MEDIA_ALIAS.replace(':alias',media.alias),media);
    }

    deleteMedia(alias){
        return this.httpClientService.deleteRequest(this.MEDIA_CONSTANTS.API.MEDIA_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
       return this.httpClientService.postRequest(this.MEDIA_CONSTANTS.API.MEDIA_STATUS,data);
    }


    getMedias(alias){
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.MEDIAS.replace(':alias',alias)+"?isId=false",{});
    }

    uploadMedia(files,name,description,mediaType,productType){
            const formData = new FormData();
            formData.append('file', files);
            formData.append('name',name);
            formData.append('description',description);
            formData.append('mediaType',mediaType);
            formData.append('productType',productType);
            return this.httpClientService.uploadRequest(this.MEDIA_CONSTANTS.API.MEDIA_UPLOAD, formData);
    }

    uploadImage(files,mediaId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('mediaId',mediaId);
        return this.httpClientService.uploadRequest(this.MEDIA_CONSTANTS.API.IMAGE_UPLOAD, formData);
    }

    getMediaByProductType(page,pageSize,query,alias){
       var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
       return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.MEDIA_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+data,{});
    }

    getFirmwareMediaByProductType(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.FIRMWARE_TYPE_MEDIA.replace(':alias',alias)+data,{});
    }

    getProductType(alias) {
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    getClient(ownerId) {
        return this.httpClientService.getRequest(this.MEDIA_CONSTANTS.API.CLIENT.replace(':alias', ownerId) + '?isId=false', {});
    }

}
