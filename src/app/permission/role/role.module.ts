import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { TemplateModule} from '../../template/template.module';
import { LayoutModule } from '../../layout/layout.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';


import { RoleFormModalComponent } from './views/role-form-modal/role-form-modal.component';
import { RoleFeatureModalComponent } from './views/role-feature-modal/role-feature-modal.component';


import { RoleRoutingModule } from './role-routing.module';

import { RoleService } from './services/role.service';


@NgModule({
    declarations: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        RoleFormModalComponent,
        RoleFeatureModalComponent

    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        LayoutModule,
        PerfectScrollbarModule,
        RoleRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        RoleFormModalComponent,
        RoleFeatureModalComponent
    ],
    providers: [RoleService],
    bootstrap: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        RoleFormModalComponent,
        RoleFeatureModalComponent

    ]
})
export class RoleModule { }
