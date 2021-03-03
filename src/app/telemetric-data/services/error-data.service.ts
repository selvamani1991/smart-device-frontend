import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { TELEMETRIC_DATA_CONSTANTS } from '../constants';

@Injectable()
export class ErrorDataService {
    TELEMETRIC_DATA_CONSTANTS= TELEMETRIC_DATA_CONSTANTS;

    constructor(private httpClientService: HttpClientService ) {
        this.TELEMETRIC_DATA_CONSTANTS = TELEMETRIC_DATA_CONSTANTS;
    }

    getAllErrorDatas(page, pageSize, alias) {
        var data = '?page=' + page + '&pageSize=' + pageSize;
        return this.httpClientService.getRequest(this.TELEMETRIC_DATA_CONSTANTS.API.ERROR_DATA.replace(':alias', alias) + data, {});
    }

    getErrorData(alias) {
        return this.httpClientService.getRequest(this.TELEMETRIC_DATA_CONSTANTS.API.ERROR_DATA_ALIAS.replace(':alias', alias), {});
    }

    updateErrorData(errorData) {
        return this.httpClientService.postRequest(this.TELEMETRIC_DATA_CONSTANTS.API.ERROR_DATA_ALIAS.replace(':alias', errorData.alias), errorData);
    }
}

