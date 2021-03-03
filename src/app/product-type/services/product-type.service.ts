import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { PRODUCT_TYPE_CONSTANTS } from '../constants';

@Injectable()
export class ProductTypeService {
    PRODUCT_TYPE_CONSTANTS= PRODUCT_TYPE_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.PRODUCT_TYPE_CONSTANTS = PRODUCT_TYPE_CONSTANTS;
    }

    getAllProductTypes(page, pageSize, query) {
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&softDeleted=false';
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE + data, {});
    }

    getAllBoardProductTypes(alias) {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARD_PRODUCT_TYPE.replace(':alias', alias) + '?isId=false', {});
    }

    getAllCities(page, pageSize) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE + data, {});
    }

    getProductType(alias) {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    getAllBoards(page, pageSize) {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARDS, {});
    }

    getProductCategorys() {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_CATEGORYS, {});
    }

    getProductTypeById(id) {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', id) + '?isId=true', {});
    }

    saveProductType(productType) {
        return this.httpClientService.putRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE, productType);
    }

    updateProductType(productType) {
        return this.httpClientService.postRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', productType.alias), productType);
    }

    deleteProductType(alias) {
        return this.httpClientService.deleteRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=true', {});
    }

    uploadImage(files, productTypeId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('productTypeId', productTypeId);
        return this.httpClientService.uploadRequest(this.PRODUCT_TYPE_CONSTANTS.API.IMAGE_UPLOAD, formData);
    }

    uploadFile(files, name, description, modelNo, subscriptionId, productCategoryAlias, productTypeId, provider,payment) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('modelNo', modelNo);
        formData.append('subscriptionId', subscriptionId);
        formData.append('productCategoryAlias', productCategoryAlias);
        formData.append('productTypeId', productTypeId);
        formData.append('provider', provider);
        formData.append('payment', payment);
        return this.httpClientService.uploadRequest(this.PRODUCT_TYPE_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    getComponent() {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.COMPONENT, {});
    }

    uploadComponentImageImage(files, productTypeId, componentId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('productTypeId', productTypeId);
        formData.append('componentId', componentId);
        return this.httpClientService.uploadRequest(this.PRODUCT_TYPE_CONSTANTS.API.COMPONENT_IMAGE_UPLOAD, formData);
    }

    getSubscription() {
        var data = '?active=true';
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.SUBSCRIPTION + data, {});
    }

    getBoardTypeByProductType(page, pageSize, query, alias) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&query=' + query+"&order=desc&orderField=assignedDate";
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARD_PRODUCT_TYPE_BY_PRODUCT_TYPE.replace(':alias', alias) + data, {});
    }

    getMachineTypeByProductType(page, pageSize, query, alias) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.MACHINE_PRODUCT_TYPE_BY_PRODUCT_TYPE.replace(':alias', alias) + data, {});
    }

    getBoardByBoardProductType(page, pageSize, query, alias) {
        var data='?page='+page+'&pageSize='+ pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARD_BOARD_PRODUCT_TYPE.replace(':alias', alias) + data, {});
    }

    getMachineByMachineProductType(page, pageSize, query, alias) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.MACHINE_MACHINE_PRODUCT_TYPE.replace(':alias', alias) + data, {});
    }

    getClient(ownerId) {
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.CLIENT.replace(':alias', ownerId) + '?isId=false', {});
    }

    getMachineProductType(alias){
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.MACHINE_PRODUCT_TYPE.replace(':alias',alias)+"?isId=false",{});
    }

    getBoardProductType(alias){
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARD_PRODUCT_TYPE_DATA.replace(':alias',alias)+"?isId=false",{});
    }

    updateBoard(board) {
        return this.httpClientService.postRequest(this.PRODUCT_TYPE_CONSTANTS.API.BOARD_STATUS.replace(':alias', board.alias), board);
    }

    updateMachine(machine) {
        return this.httpClientService.postRequest(this.PRODUCT_TYPE_CONSTANTS.API.MACHINE_STATUS.replace(':alias', machine.alias), machine);
    }

    deleteProfilePicture(productType){
        return this.httpClientService.postRequest(this.PRODUCT_TYPE_CONSTANTS.API.PRODUCT_TYPE_ALIAS.replace(':alias', productType.alias),productType);
    }

    getCurrentSubscriptions(){
        var data="?active=true";
        return this.httpClientService.getRequest(this.PRODUCT_TYPE_CONSTANTS.API.CURRENT_SUBSCRIPTIONS+data,{});
    }

}
