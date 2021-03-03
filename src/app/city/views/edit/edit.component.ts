import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CITY_CONSTANTS } from '../../constants';
import { CITY_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { CityService } from '../../services/city.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    city: any= {};
    cities= [];
    selectedCity= {id: 0, state: '', name: '', country: ''};
    cityForm: FormGroup;
    CITY_CONSTANTS= CITY_CONSTANTS;
    CITY_VALIDATOR= CITY_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: CITY_CONSTANTS.LABEL.CITY,
        pageTitle: CITY_CONSTANTS.LABEL.CITY_EDIT,
        pageDesc: CITY_CONSTANTS.LABEL.CITY_EDIT_DESC
    };
    steps= [];
    buttonName= CITY_CONSTANTS.LABEL.CITY_ACTION_EDIT;
    backUrl= CITY_CONSTANTS.URL.CITY_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorCityname: false,
        duplicateErrorEmail: false
    };
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
        this.CITY_CONSTANTS = CITY_CONSTANTS;
        this.CITY_VALIDATOR = CITY_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_LIST_LINK, CITY_CONSTANTS.URL.CITY_LIST, true);
        breadCrumService.pushStep(CITY_CONSTANTS.LABEL.CITY_EDIT_LINK, CITY_CONSTANTS.URL.CITY_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.CITY_CONSTANTS.LABEL.CITY);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadCity(this.alias);
        });
    }

    ngOnInit() {
        this.createCityForm();
        this.loadCity(this.alias);
    }

    createCityForm(): FormGroup {
        return this.cityForm = this._formBuilder.group({
            id                  : [this.city.id],
            name                : [this.city.name, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            country             : [this.city.country, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
            state               : [this.city.state, [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],

        });
    }

    loadCity(alias) {
        this.cityService.getCity(alias)
        .subscribe(
            data => {
                this.city = data['data'][0];
                this.cityForm = this.createCityForm();
            },
            error => {
                this.sweetAlertService.notSuccessful(error.message);
                this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
                this.loading = false;
            }
        );
    }

    updateCity() {
        this.city = this.cityForm.value;
        this.city.id = this.city.id;
        this.loading = true;
        this.cityService.updateCity(this.city)
        .subscribe(
        data => {
            if (data['hasError']) {
                this.assignResponseError(data);
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

    submitForm() {
        let city = this.cityForm.value;
        if (city > 0) {
        } else {
            this.cityForm.get('city').setErrors({'required': true});
        }
    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === CITY_CONSTANTS.FIELD.NAME) {
               this.cityForm.get('name').setErrors({'duplicate': true});
            }
        }
    }

    list() {
        this.router.navigate([CITY_CONSTANTS.URL.CITY_LIST]);
    }
}
