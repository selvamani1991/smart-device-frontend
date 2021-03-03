import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import { PRODUCT_CATEGORY_CONSTANTS } from '../constants';

    @Injectable()
    export class ProductCategoryService {
        PRODUCT_CATEGORY_CONSTANTS= PRODUCT_CATEGORY_CONSTANTS;
        constructor(private httpClientService: HttpClientService ) {
            this.PRODUCT_CATEGORY_CONSTANTS = PRODUCT_CATEGORY_CONSTANTS;
    }

    getAllProductCategorys(page, pageSize, query){
        var data = '?owner=true&page=' + page + '&pageSize=' + pageSize + '&softDeleted=false' + '&query=' + query;
        return this.httpClientService.getRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY + data, {});
    }

    getProductCategory(alias) {
        return this.httpClientService.getRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_ALIAS.replace(':alias', alias) + '?isId=false', {});
    }

    saveProductCategory(productCategory) {
        return this.httpClientService.putRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY, productCategory);
    }

    updateProductCategory(productCategory) {
        return this.httpClientService.postRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_ALIAS.replace(':alias', productCategory.alias), productCategory);
    }

    deleteProductCategory(alias) {
        return this.httpClientService.deleteRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_ALIAS.replace(':alias', alias) + '?isId=false&isSoft=false', {});
    }

    changeStatus(data) {
        return this.httpClientService.postRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_STATUS, data);
    }

    updatePassword(productCategory, alias) {
        return this.httpClientService.postRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_PASSWORD_ALIAS.replace(':alias', alias), productCategory);
    }

    uploadImage(files, productCategoryId) {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('productCategoryId', productCategoryId);
        return this.httpClientService.uploadRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.FILE_UPLOAD, formData);
    }

    deleteProfilePicture(productCategory){
        return this.httpClientService.postRequest(this.PRODUCT_CATEGORY_CONSTANTS.API.PRODUCT_CATEGORY_ALIAS.replace(':alias', productCategory.alias),productCategory);
    }
}
