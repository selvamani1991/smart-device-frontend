import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { TemplateModule} from '../../template/template.module';
import { LayoutModule } from '../../layout/layout.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { CategoryFormModalComponent } from './views/category-form-modal/category-form-modal.component';
import { FeatureFormModalComponent } from './views/feature-form-modal/feature-form-modal.component';


import { FeatureCategoryRoutingModule } from './feature-category-routing.module';

import { FeatureCategoryService } from './services/feature-category.service';
import { FeatureService } from './services/feature.service';


@NgModule({
    declarations: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        CategoryFormModalComponent,
        FeatureFormModalComponent

    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        LayoutModule,
        PerfectScrollbarModule,
        FeatureCategoryRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        CategoryFormModalComponent,
        FeatureFormModalComponent

    ],
    providers: [FeatureCategoryService, FeatureService],
    bootstrap: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        CategoryFormModalComponent,
        FeatureFormModalComponent

    ]
})
export class FeatureCategoryModule { }
