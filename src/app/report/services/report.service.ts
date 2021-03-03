import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { REPORT_CONSTANTS } from '../constants';

    @Injectable()
    export class ReportService {
        REPORT_CONSTANTS= REPORT_CONSTANTS;
        constructor(private httpClientService: HttpClientService ) {
        this.REPORT_CONSTANTS = REPORT_CONSTANTS;
    }

    getCompanies() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANIES + data, {});
    }

    getBuildings() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.BUILDINGS + data, {});
    }

    getVendors() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.VENDORS + data, {});
    }

    getDistributorProducts() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.DISTRIBUTOR_PRODUCTS + data, {});
    }

    getDistributors() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.DISTRIBUTORS + data, {});
    }

    getMachines() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.VENDOR_PRODUCTS + data, {});
    }

    getZones() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.ZONES + data, {});
    }

    getProductType() {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.PRODUCT_TYPE, {});
    }

    getProductTypes() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.PRODUCT_TYPES + data, {});
    }

    getProducts() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_PRODUCT + data, {});
    }

    getCompanyBuildingProducts() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_BUILDING_PRODUCT + data, {});
    }

    getClientProducts() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.CLIENT_PRODUCT + data, {});
    }

    getCompanyBuildingByCompanyId(alias) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_BUILDINGS.replace(':companyAlias', alias), {});
    }

    getCompanyBuildings() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_BUILDING + data, {});
    }

    getProductDataByProduct(page, pageSize, query, alias, startDate, endDate) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&endDate=' + endDate + '&startDate=' + startDate;
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.PRODUCT_DATA_ALIAS.replace(':alias', alias) + data, {});
    }

    getVendorData(request,page,pageSize) {
        var data="?page="+page+"&pageSize="+pageSize;
         return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.VENDOR_DATA, request);
    }

    getDistributorData(request) {
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.DISTRIBUTOR_DATA, request);
    }

    getClientData(request) {
           return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.CLIENT_DATA, request);
    }

    getCompanyData(request) {
         return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.COMPANY_DATA, request);
    }

    getCompanyBuildingData(request,page,pageSize) {
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.COMPANY_BUILDING_DATA, request);
    }

    downloadData(request) {
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.DOWNLOAD_DATA, request);
    }

    getBuilding(ownerId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_BUILDING_LIST.replace(':ownerId', ownerId), {});
    }

    getCompany(ownerId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_LIST.replace(':ownerId', ownerId), {});
    }

    getMachineByBuilding(ownerId) {
       return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.MACHINE_BY_BUILDING.replace(':ownerId', ownerId), {});
    }

    getCurrentProductType() {
       return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.CURRENT_PRODUCT_TYPE, {});
    }

    getProductByCompanyBuilding(ownerId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.PRODUCT_BY_COMPANY_BUILDING.replace(':ownerId', ownerId), {});
    }

    getProductByCompanyBuildingAndProductType(ownerId, productTypeId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.PRODUCT_BY_COMPANY_BUILDING_AND_PRODUCT_TYPE.replace(':ownerId', ownerId).replace(':productTypeId', productTypeId), {});
    }

    getDistributorsList(ownerId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.DISTRIBUTOR_LIST.replace(':ownerId', ownerId), {});
    }

    getVendorOfClient() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.VENDOR_OF_CLIENT + data, {});
    }

    getCompanyOfClient() {
        var data = '?owner=true';
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.COMPANY_OF_CLIENT + data, {});
    }

    getClientVendorData(request,page,pageSize) {
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.CLIENT_VENDOR_DATA, request);
    }

    getClientCompanyData(request,page,pageSize) {
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.CLIENT_COMPANY_DATA, request);
    }

    getClientErrorData(request,page,pageSize) {
        var data="?page="+page+"&pageSize="+pageSize;
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.CLIENT_ERROR_DATA, request);
    }

    downloadErrorData(request) {
        return this.httpClientService.postRequest(this.REPORT_CONSTANTS.API.DOWNLOAD_ERROR_DATA, request);
    }

    getClient(ownerId) {
        return this.httpClientService.getRequest(this.REPORT_CONSTANTS.API.CLIENT.replace(':alias', ownerId) + '?isId=false', {});
    }
}
