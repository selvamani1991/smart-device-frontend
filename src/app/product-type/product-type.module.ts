import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TranslateModule}       from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { ShowComponent } from './views/show/show.component';
import { EditComponent } from './views/edit/edit.component';
import { ProductTypeBoardComponent } from './views/product-type-board/product-type-board.component';
import { ProductTypeService } from './services/product-type.service';
import { ProductTypeRoutingModule }   from './product-type-routing.module';
import { ClientModule} from '../client/client.module';
import { ProductModule} from '../product/product.module';
import { MediaModule} from '../media/media.module';
import { ProductTypeMachineComponent } from './views/product-type-machine/product-type-machine.component';
import { BoardsComponent } from './views/boards/boards.component';
import { MachinesComponent } from './views/machines/machines.component';


@NgModule({
    declarations: [
        ShowComponent,
        ListComponent,
        EditComponent,
        CreateComponent,
        ProductTypeBoardComponent,
        ProductTypeMachineComponent,
        BoardsComponent,
        MachinesComponent
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
        ProductTypeRoutingModule,
        ClientModule,
        ProductModule,
        MediaModule
    ],

    exports: [
         ShowComponent,
         ListComponent,
         EditComponent,
         CreateComponent,
         ProductTypeBoardComponent,
         ProductTypeMachineComponent,
         BoardsComponent,
         MachinesComponent
    ],
    providers: [ProductTypeService],
    bootstrap: [
           ShowComponent,
           ListComponent,
           EditComponent,
           CreateComponent,
           ProductTypeBoardComponent,
           ProductTypeMachineComponent,
           BoardsComponent,
           MachinesComponent
    ]
})
export class ProductTypeModule { }