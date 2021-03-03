import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CITY_CONSTANTS } from '../../constants';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CityService } from '../../services/city.service';
import { ERROR_CODE } from '../../../constants';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
    cities: any = [];
    users= [];
    city: any= {};
    services= [];
    form: any= {};
    loading = false;
    CITY_CONSTANTS= CITY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    paginationItems= [];
    itemSize= 0;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CITY_CONSTANTS.LABEL.CITY,
        pageTitle: CITY_CONSTANTS.LABEL.CITY_LIST,
        pageDesc: CITY_CONSTANTS.LABEL.CITY_LIST_DESC
    };
    steps= [];
    totalSize= 0;
    currentPage= 0;
    pageSize= 8;
    totalPages= 0;
    query= '';
    constructor(
    private router: Router,
    private cityService: CityService,
    private alertService: AlertService,
    breadCrumService: BreadCrumService,
    private httpResponseService: HttpResponseService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        this.currentPage = 1;
        this.pageSize = this.APP_CONFIG.PAGE_SIZE;
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_LIST_LINK, CITY_CONSTANTS.URL.CITY_LIST, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CITY_CONSTANTS.LABEL.CITY);
    }

    ngOnInit() {
        this.loadCity();
    }

    loadCity() {
        this.loading = true;
        this.cityService.getAllCities(this.currentPage, this.pageSize, this.query)
        .subscribe(
        data => {
            this.cities = data['data'];
            this.paginationItems = this.cities;
            this.itemSize = this.paginationItems.length;
            this.currentPage = data['page'];
            this.pageSize = data['pageSize'];
            this.totalSize = data['count'];
            var reminder = this.totalSize % this.pageSize;
            this.totalPages = reminder == 0 ? Math.floor(this.totalSize / this.pageSize) : Math.floor(this.totalSize / this.pageSize) + 1;
            this.loading = false;
        },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    addCity() {
        this.router.navigate([CITY_CONSTANTS.URL.CITY_CREATE]);
    }

    showCity(city) {
        this.router.navigate([CITY_CONSTANTS.URL.CITY_SHOW, city.alias]);
    }

    edit(city) {
        this.router.navigate([CITY_CONSTANTS.URL.CITY_EDIT, city.alias]);
    }

    changePage(event) {
      this.currentPage = event;
      this.loadCity();
    }

    changePageSize(event) {
      this.pageSize = event;
      this.loadCity();
    }

    markDeleted(city) {
        this.sweetAlertService.deleteCheck(this, city);
    }

    reloadList() {
        this.loadCity();
    }

    remove(city) {
        this.cityService.deleteCity(city.alias)
        .subscribe(
        data => {
            if (!data['hasError'] && data['data'][0].successCode == SUCCESS_CODE.code_5) {
            city.isDeleted = true;
            city.isActive = false;
            this.sweetAlertService.deleteConfirmation(this.setting.entity);
            this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
            this.loadCity();
        }else {
            this.sweetAlertService.notSuccessful(data['error'].errorMessage);
        }
    },
        error => {
            this.alertService.error(error.message);
            this.loading = false;
        });
    }

    changeStatus(city, status) {
       city.active = status;
       this.cityService.updateCity(city)
       .subscribe(
        data => {
            if (data['hasError']) {
               this.assignResponseError(data, this.form);
            } else {
               this.sweetAlertService.updateConfirmation(this.setting.entity);
               this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
            }
            this.loading = false;
        },
        failure => {
           this.httpResponseService.showErrorResponse(failure);
           this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
           this.loading = false;
        });
    }

    assignResponseError(data, form) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CITY_CONSTANTS.FIELD.NAME) {
                form.form.controls[CITY_CONSTANTS.FIELD.NAME].setErrors({'duplicate': true});
            }
        }
    }

    searchCity(newValue) {
        var myModel = newValue;
        if (myModel.length > 1) {
           this.query = myModel;
           this.loadCity();
        }else {
            this.query = '';
            this.loadCity();
        }
    }
}
