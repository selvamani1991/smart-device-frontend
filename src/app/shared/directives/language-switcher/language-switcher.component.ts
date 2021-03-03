import { Component, OnInit } from '@angular/core';
import { LOCALES } from '../../../constants';
import { CommonModule } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
    moduleId: module.id.toString(),
    selector: 'language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: []
})

export class LanguageSwitcherComponent {
    LOCALES= LOCALES;
    language: any;

    constructor(translate: TranslateService) {
        this.LOCALES = LOCALES;
        this.language = {
            // list of available languages
            available: LOCALES.locales,
            // display always the current ui language
            selected: {},

            getLanguage: function(localeId){
                for (let i = 0; i < this.available.length; i++) {
                    if (this.available[i].localeId == localeId) {
                        return this.available[i];
                    }
                }
            },
            init: function () {
                var proposedLanguage = translate.currentLang || translate.getBrowserLang();
                var preferredLanguage = localStorage.getItem('currentLang');
                // we know we have set a preferred one in app.config
                this.selected = this.getLanguage((preferredLanguage || proposedLanguage));
                translate.use(this.selected.localeId);
            },
            set: function (localeId) {
                translate.use(localeId);
                localStorage.setItem('currentLang', localeId);
                this.selected = this.getLanguage(localeId);
            }
        };
        this.language.init();
    }
}
