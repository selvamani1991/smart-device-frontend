import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { RoleModule} from './role/role.module';
import { FeatureCategoryModule} from './feature-category/feature-category.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PermissionRoutingModule } from './permission-routing.module';


@NgModule({
    declarations: [
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        PerfectScrollbarModule,
        PermissionRoutingModule,
        RoleModule,
        FeatureCategoryModule
    ],
    exports: [
    ],
    providers: [

    ],
    bootstrap: [
    ]
})
export class PermissionModule { }
