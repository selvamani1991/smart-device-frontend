import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { VENDOR_CONSTANTS } from '../constants';

@Injectable()
export class VendorService {
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
    }

    getAllVendors(page, pageSize, query) {
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR + data, {});
    }

    getVendor(alias) {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    getVendors(){
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR, {});
    }

    getZones(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.ZONES+data, {});
    }

    getDistributors(page, pageSize){
       return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.DISTRIBUTORS, {});
    }

    getCities(page, pageSize, query){
        var data = '?search=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query;
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.CITIES + data, {});
    }

    saveVendor(vendor) {
        return this.httpClientService.putRequest(this.VENDOR_CONSTANTS.API.VENDOR, vendor);
    }

    updateVendor(vendor) {
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.VENDOR_ALIAS.replace(':alias', vendor.alias), vendor);
    }

    deleteVendor(alias) {
        return this.httpClientService.deleteRequest(this.VENDOR_CONSTANTS.API.VENDOR_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=false', {});
    }

    changeStatus(data) {
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.VENDOR_STATUS, data);
    }

    uploadImage(files, vendorId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('vendorId', vendorId);
        return this.httpClientService.uploadRequest(this.VENDOR_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    updatePassword(vendor, alias) {
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.VENDOR_PASSWORD_ALIAS.replace(':alias', alias), vendor);
    }

    getVendorSubscription(page, pageSize, alias,query) {
         var data="?active=false&page="+page+"&pageSize="+pageSize+"&query="+query;
         return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR_SUBSCRIPTION_LIST.replace(':alias', alias) + data, {});
    }

    saveVendorSubscription(vendorSubscription) {
        return this.httpClientService.putRequest(this.VENDOR_CONSTANTS.API.VENDOR_SUBSCRIPTION, vendorSubscription);
    }

    getVendorSubscriptions(alias) {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR_SUBSCRIPTION_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    updateVendorSubscription(vendorSubscription) {
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.VENDOR_SUBSCRIPTION_ALIAS.replace(':alias', vendorSubscription.alias), vendorSubscription);
    }

    getClient(ownerId) {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.CLIENT.replace(':alias', ownerId) + '?isId=false', {});
    }

    deleteProfilePicture(vendor){
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.VENDOR_ALIAS.replace(':alias', vendor.alias),vendor);
    }

    getSubscription() {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.CLIENT_MODAL_SUBSCRIPTION, {});
    }

    getCompanyZones(ownerId) {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.ZONES_OWNER_ID.replace(':ownerId', ownerId),{});
    }
}
