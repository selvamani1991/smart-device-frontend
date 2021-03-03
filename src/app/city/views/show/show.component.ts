import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { SUCCESS_CODE, ERROR_CODE } from '../../../constants';
import { CityService} from '../../services/city.service';
import { CITY_CONSTANTS } from '../../../city/constants';

import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
    loading = false;
    formatError= false;
    files: any= [];
    city: any= {};
    cities= [];
    services= [];
    cityForm: FormGroup;
    CITY_CONSTANTS= CITY_CONSTANTS;
    APP_CONFIG= APP_CONFIG;
    SUCCESS_CODE= SUCCESS_CODE;
    ERROR_CODE= ERROR_CODE;
    setting= {
      entity:  CITY_CONSTANTS.LABEL.CITY_IMAGES,
      pageTitle: CITY_CONSTANTS.LABEL.CITY_SHOW,
      pageDesc: CITY_CONSTANTS.LABEL.CITY_SHOW_DESC
    };
    alias: any;
    formValidation= {
        duplicateErrorBranchname: false,
        duplicateErrorEmail: false
    };
    steps= [];
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private _formBuilder: FormBuilder,
    breadCrumService: BreadCrumService,
    private httpResponseService: HttpResponseService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.SUCCESS_CODE = SUCCESS_CODE;
        this.ERROR_CODE = ERROR_CODE;
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_LIST_LINK, CITY_CONSTANTS.URL.CITY_LIST, true);
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_SHOW_LINK, CITY_CONSTANTS.URL.CITY_SHOW, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CITY_CONSTANTS.LABEL.CITY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCity();
        });
    }

    ngOnInit() {
        this.createCityForm();
        this.loadCity();
    }

    createCityForm(): FormGroup {
        return this.cityForm = this._formBuilder.group({
            id                  : [this.city.id],
            name                : [this.city.name, []],
            country             : [this.city.country, []],
            state               : [this.city.state, []],

        });
    }

    loadCity() {
        this.cityService.getCity(this.alias)
        .subscribe(
        data => {
            this.city = data['data'][0];
            this.cityForm = this.createCityForm();
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
            this.loading = false;
        });
    }

    processFile() {
        this.cityService.uploadImage(this.files, this.city.id)
        .subscribe(
        data => {
            this.city = data['data'][0];
            this.sweetAlertService.uploadSuccessfully(this.setting.entity);
        },
        error => {
            this.sweetAlertService.notSuccessful(error.message);
        });
    }

    onFileChange(event) {
        this.files = event.target.files[0];

        var pattern = /image-*/;
        if (!this.files.type.match(pattern)) {
            this.formatError = true;
            return;
        } else {
            this.formatError = false;
        }
        this.processFile();
    }
}
