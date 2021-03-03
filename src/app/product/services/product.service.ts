import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { PRODUCT_CONSTANTS } from '../constants';

@Injectable()
export class ProductService {
    PRODUCT_CONSTANTS=PRODUCT_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.PRODUCT_CONSTANTS=PRODUCT_CONSTANTS;
    }

    getAllProducts(page,pageSize,query){
        var data="&owner=true&page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=manufacturerDate&softDeleted=true";
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT+data,{});
    }

    getProduct(alias){
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_ALIAS.replace(':alias',alias)+"?isId=false",{});
    }

    getAllProductTypes(page,pageSize){
         var data="?owner=true&page="+page+"&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getProductTypes(page,pageSize){
        var data="?owner=true&page="+page+"&pageSize="+pageSize;
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    saveProductType(productType){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_TYPE,productType);
    }

    getProductById(id){
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_ALIAS.replace(':alias',id)+"?isId=true",{});
    }

    saveProduct(product){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.PRODUCT,product);
    }
     
    updateProduct(product){
        return this.httpClientService.postRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_ALIAS.replace(':alias',product.alias),product);
    }
     
    deleteProduct(product){
        return this.httpClientService.deleteRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_ALIAS.replace(':alias',product.alias)+"?isId=false&isSoft=true",{});
    }

    uploadImage(files,productId){
        const formData = new FormData();
        formData.append('file', files);
        formData.append('productId',productId);
        return this.httpClientService.uploadRequest(this.PRODUCT_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getMachines(pageSize,alias){
        var data="?status=Dispatched&page=1&pageSize="+pageSize+"&softDeleted=false";
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.MACHINES_ALIAS.replace(':alias',alias)+data,{});
    }

    getBoards(pageSize,alias){
       var data="?status=Dispatched&page=1&pageSize="+pageSize+"&softDeleted=false";
       return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.BOARDS_ALIAS.replace(':alias',alias)+data,{});
    }

    getProducts(page,pageSize,query,alias){
       var data="?page="+page+"&pageSize="+pageSize+"&query="+query+"&order=desc&orderField=manufacturerDate";
       return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_PRODUCT_TYPE_ALIAS.replace(':alias',alias)+data,{});
    }

     getProductDataByProduct(request,page,pageSize){
       var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.postRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_DATA_ALIAS,request);
    }

    downloadProductData(request){
        return this.httpClientService.postRequest(this.PRODUCT_CONSTANTS.API.DOWNLOAD_DATA,request);
    }

    getClientSubscription(){
            var data="?active=true";
            return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.CLIENT_SUBSCRIPTION_ALIAS+data,{});
    }

    saveManufacturerProduct(manufacturerProduct){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.MANUFACTURER_PRODUCT,manufacturerProduct);
    }

    saveBoardManufacturerProduct(boardManufacturerProduct){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.BOARD_MANUFACTURER_PRODUCT,boardManufacturerProduct);
    }

    getManufacturers(page,pageSize){
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.MANUFACTURERS,{});
    }

    getBoardManufacturers(page,pageSize){
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.BOARD_MANUFACTURERS,{});
    }

    saveBoardProductType(boardProductType){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.BOARD_PRODUCT_TYPE,boardProductType);
    }

    getProductType(){
        return this.httpClientService.putRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_TYPE,{});
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.PRODUCT_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    updateProductType(productType){
        return this.httpClientService.postRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias',productType.alias),productType);
    }

    deleteProfilePicture(product){
        return this.httpClientService.postRequest(this.PRODUCT_CONSTANTS.API.PRODUCT_ALIAS.replace(':alias', product.alias),product);
    }
}
