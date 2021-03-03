import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

import { APP_CONFIG } from '../../constants';

@Injectable()
export class HttpClientService {
    CONFIG= APP_CONFIG;
    baseUrl= '';
    baseUploadUrl= '';
    contextUrl= '';
    constructor(private http: HttpClient ) {
        this.CONFIG = APP_CONFIG;
        this.baseUrl = this.CONFIG.CONTEXT + this.CONFIG.API_URL + this.CONFIG.API_VERSION;
        this.baseUploadUrl = this.CONFIG.CONTEXT + '/mvc' + this.CONFIG.API_URL + this.CONFIG.API_VERSION;

        this.contextUrl = this.CONFIG.CONTEXT;
    }

    getRequest(url, data) {
        return this.http.get(this.baseUrl + url, data);
    }

    postRequest(url, data) {
        return this.http.post(this.baseUrl + url, data);
    }

    putRequest(url, data) {
        return this.http.put(this.baseUrl + url, data);
    }

    deleteRequest(url, data) {
        return this.http.delete(this.baseUrl + url, data);
    }

    uploadRequest(url, data) {
        return this.http.post(this.baseUploadUrl + url, data);
    }

    downloadRequest(url, data) {
        return this.http.get(this.baseUploadUrl + url, data);
    }
}
