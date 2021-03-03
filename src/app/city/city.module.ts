import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import {TranslateModule}       from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { ShowComponent } from './views/show/show.component';
import { EditComponent } from './views/edit/edit.component';
import { CityService } from './services/city.service';
import { CityRoutingModule }   from './city-routing.module';

@NgModule({
    declarations: [
        ShowComponent,
        ListComponent,
        EditComponent,
        CreateComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        CityRoutingModule
    ],

    exports: [
        ShowComponent,
        ListComponent,
        EditComponent,
        CreateComponent
    ],

    providers: [CityService],
    bootstrap: [
        ShowComponent,
        ListComponent,
        EditComponent,
        CreateComponent
    ]
})
export class CityModule { }

