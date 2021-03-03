import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MachineListComponent } from './views/machine-list/machine-list.component';
import { CreateComponent } from './views/create/create.component';
import { MachineService } from './services/machine.service';
import { MachineRoutingModule } from './machine-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MachineListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        PerfectScrollbarModule,
        MachineRoutingModule,
        ReactiveFormsModule
    ],

    exports: [
        MachineListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ],

    providers: [MachineService    ],
    bootstrap: [
        MachineListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ]
})
export class MachineModule { }

