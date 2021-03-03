import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { HttpClientService } from '../../shared/services/http-client.service';
import { TELEMETRIC_DATA_CONSTANTS } from '../constants';

@Injectable()
export class TelemetricDataService {
    TELEMETRIC_DATA_CONSTANTS= TELEMETRIC_DATA_CONSTANTS;
    constructor(private httpClientService: HttpClientService ) {
        this.TELEMETRIC_DATA_CONSTANTS = TELEMETRIC_DATA_CONSTANTS;
    }

    getAllTelemetricDatas(page, pageSize, alias, componentId,startDate,endDate) {
         var data = '?page=' + page + '&pageSize=' + pageSize + '&componentId=' + componentId+'&startDate=' + startDate+'&endDate=' + endDate+"&order=desc&orderField=processTime";
        return this.httpClientService.getRequest(this.TELEMETRIC_DATA_CONSTANTS.API.TELEMETRIC_DATA.replace(':alias', alias) + data, {});
    }

/*    getAllTelemetricDatas(page, pageSize, alias, componentId,startDate,endDate) {
        var data = '?page=' + page + '&pageSize=' + pageSize + '&componentId=' + componentId+ '&startDate=' + startDate +'&endDate=' + endDate +"&order=desc&orderField=entryTime";
        return this.httpClientService.getRequest(this.TELEMETRIC_DATA_CONSTANTS.API.TELEMETRIC_DATA.replace(':alias', alias) + data, {});
    }*/

    getTelemetricData(alias) {
        return this.httpClientService.getRequest(this.TELEMETRIC_DATA_CONSTANTS.API.TELEMETRIC_DATA_ALIAS.replace(':alias', alias), {});
    }

    updateTelemetricData(telemetricData) {
        return this.httpClientService.postRequest(this.TELEMETRIC_DATA_CONSTANTS.API.TELEMETRIC_DATA_ALIAS.replace(':alias', telemetricData.alias), telemetricData);
    }
}
