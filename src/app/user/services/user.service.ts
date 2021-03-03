import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { USER_CONSTANTS } from '../constants';

@Injectable()
export class UserService {
    USER_CONSTANTS= USER_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.USER_CONSTANTS = USER_CONSTANTS;
    }

    getAllUser(page, pageSize, query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.USER_CONSTANTS.API.USER + data, {});
    }

    getAllUserTypes(page, pageSize){
        var data = '?page=' + page + '&pageSize=' + pageSize;
        return this.httpClientService.getRequest(this.USER_CONSTANTS.API.USER_TYPES + data, {});
    }

    getUser(alias){
        return this.httpClientService.getRequest(this.USER_CONSTANTS.API.USER_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    saveUser(user){
        return this.httpClientService.putRequest(this.USER_CONSTANTS.API.USER, user);
    }

    updateUser(user){
        return this.httpClientService.postRequest(this.USER_CONSTANTS.API.USER_ALIAS.replace(':alias', user.alias), user);
    }

    deleteUser(alias){
        return this.httpClientService.deleteRequest(this.USER_CONSTANTS.API.USER_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=true', {});
    }

    deleteProfilePicture(user){
        return this.httpClientService.postRequest(this.USER_CONSTANTS.API.PROFILE_PICTURE.replace(':alias', user.alias),user);
    }

    changeStatus(data){
        return this.httpClientService.postRequest(this.USER_CONSTANTS.API.USER_STATUS, data);
    }

    updatePassword(alias, user){
        return this.httpClientService.postRequest(this.USER_CONSTANTS.API.USER_ALIAS.replace(':alias', alias), user);
    }

    uploadImage(files, userId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('userId', userId);
        return this.httpClientService.uploadRequest(this.USER_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getCurrentAdminImage(alias, userType){
        var data = '?userType=' + userType;
        return this.httpClientService.getRequest(this.USER_CONSTANTS.API.CURRENT_ADMIN_ALIAS.replace(':alias', alias) + data, {});
    }

}