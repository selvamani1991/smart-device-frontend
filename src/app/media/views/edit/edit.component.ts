import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MEDIA_CONSTANTS } from '../../constants';
import { MEDIA_VALIDATOR } from '../../validator';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { MediaService } from '../../services/media.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { HttpResponseService } from '../../../shared/services/http-response.service';
declare var  $: any;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {
    loading = false;
    media: any= {};
    mediaTypes= [];
    selectedMediaType= '';
    mediaForm: FormGroup;
    MEDIA_CONSTANTS= MEDIA_CONSTANTS;
    MEDIA_VALIDATOR= MEDIA_VALIDATOR;
    APP_CONFIG= APP_CONFIG;
    ERROR_CODE= ERROR_CODE;
    setting = {
        entity: MEDIA_CONSTANTS.LABEL.MEDIA,
        pageTitle: MEDIA_CONSTANTS.LABEL.MEDIA_EDIT,
        pageDesc: MEDIA_CONSTANTS.LABEL.MEDIA_EDIT_DESC
    };
    steps= [];
    buttonName= MEDIA_CONSTANTS.LABEL.MEDIA_ACTION_EDIT;
    backUrl= MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST;
    alias: any= {};
    formValidation= {
        duplicateErrorMedianame: false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private mediaService: MediaService,
                private _formBuilder: FormBuilder,
                private httpResponseService: HttpResponseService,
                breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG = APP_CONFIG;
        this.MEDIA_CONSTANTS = MEDIA_CONSTANTS;
        this.MEDIA_VALIDATOR = MEDIA_VALIDATOR;
        this.ERROR_CODE = ERROR_CODE;
        breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.MEDIA_LIST_LINK, MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST, true);
        breadCrumService.pushStep(MEDIA_CONSTANTS.LABEL.MEDIA_EDIT_LINK, MEDIA_CONSTANTS.URL.MEDIA_EDIT, false);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MEDIA_CONSTANTS.LABEL.MEDIA);
        this.route.params.subscribe( params => {
            this.alias = params.alias;
            this.loadMedia(this.alias);
        });
        this.mediaTypes = [
            {'id': 'firmware', 'name': 'FirmWare'},
            {'id': 'media', 'name': 'Media'}
        ];
    }

    ngOnInit() {
        let _self = this;
        this.mediaForm = this.createMediaForm();
        $('#mediaSelect').select2({
            width: '100%'
        });

        setTimeout(function(){
            $('#mediaSelect').on('select2:select', function(e){
                let selectId = e.params.data.id;
                _self.selectedMediaType = selectId;
            });
        }, 1000);

    }

    createMediaForm(): FormGroup {
        this.selectedMediaType = this.media.mediaType ? this.media.mediaType : '';
        return this.mediaForm = this._formBuilder.group({
            id                    : [this.media.id],
            alias                 : [this.media.alias],
            name                  : [this.media.name, [Validators.required, Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            description           : [this.media.description, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]],
            mediaType             : [this.selectedMediaType]
        });
    }

    updateMedia() {
        this.media = this.mediaForm.value;
        $('body').addClass('loading');
        this.media.mediaType = this.selectedMediaType;

        this.mediaService.updateMedia(this.media)
        .subscribe(
        data => {
            $('body').removeClass('loading');
            if (data['hasError']) {
                this.assignResponseError(data);
            } else {
                this.sweetAlertService.updateConfirmation(this.setting.entity);
                this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
            }
            this.loading = false;
        },

        failure => {
            $('body').removeClass('loading');
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
            this.loading = false;
        });

    }

    loadMedia(alias) {
        this.mediaService.getMedia(alias)
        .subscribe(
        data => {
            this.media = data['data'][0];
            this.mediaForm = this.createMediaForm();
            this.media.mediaType = this.selectedMediaType;
            $('#mediaSelect').select2({
                width: '100%'
            });
        },
        failure => {
            this.httpResponseService.showErrorResponse(failure);
            this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
            this.loading = false;
        });

    }

    assignResponseError(data) {
        if (data.error.errorCode === ERROR_CODE.code_14) {
            if (data.error.errorField === MEDIA_CONSTANTS.FIELD.NAME) {
                   this.mediaForm.get('name').setErrors({'duplicate': true});
            }

        }
    }

    list() {
        this.router.navigate([MEDIA_CONSTANTS.URL.MEDIA_MEDIA_LIST]);
    }
}
