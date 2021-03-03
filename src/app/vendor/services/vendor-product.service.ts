import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { VENDOR_CONSTANTS } from '../constants';

@Injectable()
export class VendorProductService {
    VENDOR_CONSTANTS= VENDOR_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.VENDOR_CONSTANTS = VENDOR_CONSTANTS;
    }

    getProducts(page, pageSize) {
        var data = 'page=' + page + '&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.PRODUCTS + data, {});
    }

    getAllVendorProducts(page, pageSize, query) {
        var data = '&owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR_PRODUCT + data, {});
    }

    getAllVendorProductLists(page, pageSize,query) {
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&query=' + query + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.ALL_VENDOR_PRODUCT + data, {});
    }

    getAllDistributors() {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.DISTRIBUTORS + '?owner=true', {});
    }

    getDistributors(pageSize) {
        var data = '?owner=true&pageSize=' + pageSize + '&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.DISTRIBUTOR + data, {});
    }

    getAllAssignedDistributorProducts(page, pageSize, query) {
        var data = '?createdBy=true&page=' + page + '&query=' + query + '&pageSize=' + pageSize + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.ASSIGNED_DISTRIBUTOR_PRODUCT + data, {});
    }

    saveDistributorProduct(distributorProduct) {
        return this.httpClientService.putRequest(this.VENDOR_CONSTANTS.API.DISTRIBUTOR_PRODUCT, distributorProduct);
    }

    getCompanies() {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.COMPANIES + '?owner=true', {});
    }

    saveCompanyProduct(companyProduct) {
        return this.httpClientService.putRequest(this.VENDOR_CONSTANTS.API.COMPANY_PRODUCT, companyProduct);
    }

    getVendorProduct(page, pageSize, query) {
        var data = '&owner=true&page=' + page + '&query=' + query + '&pageSize=' + pageSize + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.VENDOR_PRODUCTS + data, {});
    }

    updateVendorProduct(vendorProduct) {
        return this.httpClientService.postRequest(this.VENDOR_CONSTANTS.API.PRODUCT_STATUS.replace(':alias', vendorProduct.alias), vendorProduct);
    }

    getAllAssignedCompanyProducts(page, pageSize, query) {
        var data = '?createdBy=true&page=' + page + '&query=' + query + '&pageSize=' + pageSize + '&order=desc&orderField=dispatchedDate&softDeleted=false';
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.ASSIGNED_COMPANY_PRODUCT + data, {});
    }

    getInvoice(alias) {
        return this.httpClientService.getRequest(this.VENDOR_CONSTANTS.API.PRODUCT_INVOICE.replace(':alias', alias) + '?owner=true', {});
    }
}
