import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { BOARD_CONSTANTS } from '../constants';
import { APP_CONFIG } from '../../constants';

@Injectable()
export class BoardService {
    BOARD_CONSTANTS=BOARD_CONSTANTS;
    CONFIG=APP_CONFIG;
    contextUrl='';
    constructor(private httpClientService:HttpClientService ) {
        this.BOARD_CONSTANTS=BOARD_CONSTANTS;
    }

    getAllBoards(page,pageSize,query){
        var data="?owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.BOARD+data,{});
    }

    getBoard(alias){
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.BOARD_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getBoards(){
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.BOARD,{});
    }

    getProducts(page,pageSize){
        var data="?page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.PRODUCTS+data,{});
    }

    getCities(){
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.CITIES,{});
    }

    saveBoard(board){
        return this.httpClientService.putRequest(this.BOARD_CONSTANTS.API.BOARD,board);
    }

    updateBoard(board){
        return this.httpClientService.postRequest(this.BOARD_CONSTANTS.API.BOARD_ALIAS.replace(':alias',board.alias),board);
    }

    deleteBoard(alias){
        return this.httpClientService.deleteRequest(this.BOARD_CONSTANTS.API.BOARD_ALIAS.replace(':alias',alias)+"?isId=false&isSoft=true",{});
    }

    changeStatus(data){
       return this.httpClientService.postRequest(this.BOARD_CONSTANTS.API.BOARD_STATUS,data);
    }

    uploadImage(files,boardId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('boardId',boardId);
        return this.httpClientService.uploadRequest(this.BOARD_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getBoardByBoardProductType(page,pageSize,query,alias){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=manufacturerDate&softDeleted=false";
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.BOARD_BY_BOARD_PRODUCT_TYPE.replace(':alias',alias)+data,{});
    }

    updateAssignBoard(board){
        return this.httpClientService.postRequest(this.BOARD_CONSTANTS.API.UPDATE_ASSIGN_BOARD.replace(':alias',board.alias),board);
    }

    getBoardProductType(alias){
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.BOARD_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    deleteProfilePicture(board){
        return this.httpClientService.postRequest(this.BOARD_CONSTANTS.API.BOARD_ALIAS.replace(':alias', board.alias),board);
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.BOARD_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

}
