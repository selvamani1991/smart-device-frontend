import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CITY_CONSTANTS } from '../../constants';
import { CITY_VALIDATOR } from '../../validator';
import { APP_CONFIG, APP_CONSTANTS } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { CityService } from '../../services/city.service';

import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create.component.html'
})

export class CreateComponent implements OnInit {
    loading = false;
    submitted = false;
    city: any= {};
    citys= [];
    cities= [];
    selectedCity= {id: 0, state: '', name: '', country: ''};
    cityForm: FormGroup;
    CITY_CONSTANTS= CITY_CONSTANTS;
    CITY_VALIDATOR= CITY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CITY_CONSTANTS.LABEL.CITY,
        pageTitle: CITY_CONSTANTS.LABEL.CITY_CREATE,
        pageDesc: CITY_CONSTANTS.LABEL.CITY_CREATE_DESC
    };
    steps= [];
    buttonName= CITY_CONSTANTS.LABEL.CITY_ACTION_CREATE;
    backUrl= CITY_CONSTANTS.URL.CITY_LIST;
    formValidation= {
        duplicateErrorCityname: false,
        duplicateErrorEmail: false
    };
    constructor(
    private router: Router,
    private cityService: CityService,
    private _formBuilder: FormBuilder,
    private httpResponseService: HttpResponseService,
    breadCrumService: BreadCrumService,
    private sweetAlertService: SweetAlertService,
    private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        this.CITY_VALIDATOR = CITY_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_LIST_LINK, CITY_CONSTANTS.URL.CITY_LIST, true);
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_CREATE_LINK, CITY_CONSTANTS.URL.CITY_CREATE, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + APP_CONSTANTS.OTHER.DOUBLECOLON + this.CITY_CONSTANTS.LABEL.CITY);

    }

    ngOnInit() {
         this.cityForm = this.createCityForm();
    }

    createCityForm(): FormGroup {
        return this.cityForm = this._formBuilder.group({
            id                       : [this.city.id],
            name                     : [this.city.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            country                  : [this.city.country, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            state                    : [this.city.state, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],

        });
    }
    createCity() {
        this.city = this.cityForm.value;
        this.cityService.saveCity(this.city)
        .subscribe(
            data => {
                if (data['hasError']) {
                        this.assignResponseError(data);
                }else {
                    this.sweetAlertService.createConfirmation(this.setting.entity);
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

    setCity() {
        var cityId = this.cityForm.get('city').value;
        for (let i = 0; i < this.cities.length; i++) {
            if (this.cities[i].id == cityId) {
                this.selectedCity = this.cities[i];
                this.cityForm.get('state').setValue(this.selectedCity.state);
                this.cityForm.get('country').setValue(this.selectedCity.country);
            }
        }
    }

    assignResponseError(data) {
        if (data.error.errorCode == ERROR_CODE.code_14) {
            if (data.error.errorField == CITY_CONSTANTS.FIELD.NAME) {
                this.cityForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
    }

}
