import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { TemplateModule} from '../../template/template.module';
import { LayoutModule} from '../../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AllListComponent } from './views/all-list/all-list.component';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ConsumerTicketService } from './services/consumer-ticket.service';
import { ConsumerTicketRoutingModule } from './consumer-ticket-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        AllListComponent

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
        ConsumerTicketRoutingModule,
        ReactiveFormsModule,
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        AllListComponent

    ],

    providers: [ConsumerTicketService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        AllListComponent


    ]
})
export class ConsumerTicketModule { }

