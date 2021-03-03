import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BoardListComponent } from './views/board-list/board-list.component';
import { CreateComponent } from './views/create/create.component';
import { BoardService } from './services/board.service';
import { BoardRoutingModule } from './board-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        BoardListComponent,
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
        BoardRoutingModule,
        ReactiveFormsModule
    ],

    exports: [
        BoardListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ],

    providers: [BoardService ],

    bootstrap: [
        BoardListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent
    ]
})
export class BoardModule { }

