import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { RESOURCES_CONSTANTS } from '../constants';

@Injectable()
export class ResourcesService {
    RESOURCES_CONSTANTS=RESOURCES_CONSTANTS;
    constructor(private httpClientService:HttpClientService ) {
        this.RESOURCES_CONSTANTS=RESOURCES_CONSTANTS;
    }

    getCompanies(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANIES+data,{});
    }

    getBuildings(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.BUILDINGS+data,{});
    }

    getDistributorProducts(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.DISTRIBUTOR_PRODUCTS+data,{});
    }

    getDistributors(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.DISTRIBUTORS+data,{});
    }

    getMachines(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.VENDOR_PRODUCTS+data,{});
    }

    getZones(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.ZONES+data,{});
    }

    getProductType(){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.PRODUCT_TYPE,{});
    }

    getBuildingProductByBuilding(){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_BUILDING_PRODUCTS,{});
    }

    getCompanyProductByCompany(){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_PRODUCTS,{});
    }

    getDistributorProductByDistributor(){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.DISTRIBUTORS_PRODUCTS,{});
    }

    getProductTypes(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getProducts(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_PRODUCT+data,{});
    }

    getCompanyBuildingProducts(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_BUILDING_PRODUCT+data,{});
    }

    getClientProducts(productTypeId){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.PRODUCT_PRODUCT_TYPE_ALIAS.replace(':alias',productTypeId)+"?isId=false",{});
    }

    getCurrentProductType(){
       return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.CURRENT_PRODUCT_TYPE,{});
    }

    getComponent(productTypeId){
       return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPONENT.replace(':alias',productTypeId)+"?isId=false",{});
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    getMedia(productTypeId){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.MEDIA_PRODUCT_TYPE_ALIAS.replace(':alias',productTypeId)+"?isId=false",{});
    }

    getFirmware(productTypeId){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.FIRMWARE_TYPE_MEDIA.replace(':alias',productTypeId)+"?isId=false",{});
    }

    getCompanyOfClient() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_OF_CLIENT + data, {});
    }

    getBuilding(ownerId) {
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.COMPANY_BUILDING_LIST.replace(':ownerId', ownerId), {});
    }
    
    getProductByCompanyBuildingAndProductType(ownerId, productTypeId) {
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.PRODUCT_BY_COMPANY_BUILDING_AND_PRODUCT_TYPE.replace(':ownerId', ownerId).replace(':productTypeId', productTypeId), {});
    }

    getMediaData(alias, page, pageSize, query){
        var data = '?page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.MEDIA_RESOURCES.replace(':alias', alias) + data, {});
    }

    getMediaProductType(){
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.CURRENT_PRODUCT_TYPE,{});
    }

    getFotaData(request){
        return this.httpClientService.postRequest(this.RESOURCES_CONSTANTS.API.FOTA_RESOURCES, request);
    }

    getTelemetricData(alias,page,pageSize, componentId,startDate,endDate){
        var data = '?page=' + page + '&pageSize=' + pageSize + '&componentId=' + componentId+'&startDate=' + startDate+'&endDate=' + endDate;
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.TELEMETRIC_RESOURCES.replace(':alias', alias) + data, {});
    }

    getErrorData(alias,page,pageSize,startDate,endDate){
        var data = '?page=' + page + '&pageSize=' + pageSize + '&startDate=' + startDate+'&endDate=' + endDate;
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.ERROR_RESOURCES.replace(':alias', alias)+data, {});
    }

    getFirmwareMediaByProductType(alias,page,pageSize,query){
        var data="?page="+page+"&pageSize="+pageSize+"&query="+query;
        return this.httpClientService.getRequest(this.RESOURCES_CONSTANTS.API.FIRMWARE_TYPE_MEDIA.replace(':alias',alias)+data,{});
    }

}