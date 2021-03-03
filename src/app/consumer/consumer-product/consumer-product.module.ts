import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { TemplateModule} from '../../template/template.module';
import { LayoutModule} from '../../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ConsumerProductListComponent } from './views/consumer-product-list/consumer-product-list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ProductShowComponent } from './views/product-show/product-show.component';
import { ConsumerProductService } from './services/consumer-product.service';
// import { ConsumerTicketService } from './services/consumer-ticket.service';
import { ConsumerProductRoutingModule } from './consumer-product-routing.module';
import { ConsumerTicketModule } from '../../consumer/consumer-ticket/consumer-ticket.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ConsumerProductListComponent,
        CreateComponent,
        EditComponent,
        ProductShowComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        ConsumerTicketModule,
        PerfectScrollbarModule,
        ConsumerProductRoutingModule

    ],

    exports: [
        ConsumerProductListComponent,
        CreateComponent,
        EditComponent,
        ProductShowComponent
    ],

    providers: [ConsumerProductService ],

    bootstrap: [
        ConsumerProductListComponent,
        CreateComponent,
        EditComponent,
        ProductShowComponent
    ]
})
export class ConsumerProductModule { }
