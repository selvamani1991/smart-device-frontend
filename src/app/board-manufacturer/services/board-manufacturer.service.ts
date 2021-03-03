import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { BOARD_MANUFACTURER_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

@Injectable()
export class BoardManufacturerService {
    BOARD_MANUFACTURER_CONSTANTS=BOARD_MANUFACTURER_CONSTANTS;

    constructor(private httpClientService:HttpClientService ) {
        this.BOARD_MANUFACTURER_CONSTANTS=BOARD_MANUFACTURER_CONSTANTS;
    }

    getAllBoardManufacturers(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER+data,{});
    }

    getBoardManufacturer(alias){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getBoardManufacturers(){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER,{});
    }

    getProducts(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.PRODUCTS+data,{});
    }

    getManufacturers(page,pageSize){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.MANUFACTURERS,{});
    }

    getCities(page,pageSize,query){
       var data="?search=true&page="+page+"&pageSize="+pageSize+"&query="+query;
       return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.CITIES+data,{});
    }

    saveBoardManufacturer(boardManufacturer){
        return this.httpClientService.putRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER,boardManufacturer);
    }
    updateBoardManufacturer(boardManufacturer){
        return this.httpClientService.postRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_ALIAS.replace(':alias',boardManufacturer.alias),boardManufacturer);
    }

    deleteBoardManufacturer(alias){
        return this.httpClientService.deleteRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=false",{});
    }

    changeStatus(data){
       return this.httpClientService.postRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_STATUS,data);
    }

    uploadImage(files,boardManufacturerId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('boardManufacturerId',boardManufacturerId);
        return this.httpClientService.uploadRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(boardManufacturer,alias){
        return this.httpClientService.postRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_PASSWORD_ALIAS.replace(':alias',alias),boardManufacturer);
    }

    getAllBoards(page,pageSize,query){
        var data="?createdBy=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD+data,{});
    }

    saveClientBoard(clientBoard){
        return this.httpClientService.putRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.CLIENT_BOARD,clientBoard);
    }

    deleteProfilePicture(boardManufacturer){
        return this.httpClientService.postRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.BOARD_MANUFACTURER_ALIAS.replace(':alias', boardManufacturer.alias),boardManufacturer);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.BOARD_MANUFACTURER_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }
}
