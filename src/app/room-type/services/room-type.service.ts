import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { ROOM_TYPE_CONSTANTS } from '../constants';


@Injectable()
export class RoomTypeService {
    ROOM_TYPE_CONSTANTS= ROOM_TYPE_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.ROOM_TYPE_CONSTANTS = ROOM_TYPE_CONSTANTS;
    }

    getAllRoomTypes(page, pageSize, query) {
         var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE + data, {});
    }

    getRoomType(alias) {
        return this.httpClientService.getRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    saveRoomType(roomType) {
        return this.httpClientService.putRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE, roomType);
    }

    updateRoomType(roomType) {
        return this.httpClientService.postRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE_ALIAS.replace(':alias', roomType.alias), roomType);
    }

    deleteRoomType(alias) {
        return this.httpClientService.deleteRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=true', {});
    }

    changeStatus(data) {
       return this.httpClientService.postRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE_STATUS, data);
    }

    uploadImage(files, roomTypeId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('roomTypeId', roomTypeId);
        return this.httpClientService.uploadRequest(this.ROOM_TYPE_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getRoomTypes(alias) {
        var data="?owner=true";
        return this.httpClientService.getRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPES.replace(':alias', alias) + '?owner=true', {});
    }

    getCurrency() {
        return this.httpClientService.getRequest(this.ROOM_TYPE_CONSTANTS.API.CURRENCY, {});
    }

    getProductCategory() {
        return this.httpClientService.getRequest(this.ROOM_TYPE_CONSTANTS.API.PRODUCT_CATEGORIES, {});
    }

    deleteProfilePicture(roomType){
        return this.httpClientService.postRequest(this.ROOM_TYPE_CONSTANTS.API.ROOM_TYPE_ALIAS.replace(':alias', roomType.alias), roomType);
    }

}
