import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TranslateModule}       from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CreateProductComponent } from './views/create-product/create-product.component';
import { InvoiceShowComponent } from './views/invoice-show/invoice-show.component';
import { ProductWizardService } from './services/product-wizard.service';
import { ProductWizardRoutingModule }   from './product-wizard-routing.module';
import { ProductOrderCreateComponent } from './views/product-order-create/product-order-create.component';
import { OrderCreateComponent } from './views/order-create/order-create.component';
import { OrderListComponent } from './views/order-list/order-list.component';
import { ClientModule} from '../client/client.module';
import { InvoiceModule} from '../invoice/invoice.module';


@NgModule({
    declarations: [
        CreateProductComponent,
        ProductOrderCreateComponent,
        OrderCreateComponent,
        OrderListComponent,
        InvoiceShowComponent,
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
        ProductWizardRoutingModule,
        ClientModule,
        InvoiceModule

    ],

    exports: [

        CreateProductComponent,
        ProductOrderCreateComponent,
        OrderCreateComponent,
        OrderListComponent,
        InvoiceShowComponent,
    ],

    providers: [ProductWizardService],
    bootstrap: [

        CreateProductComponent,
        ProductOrderCreateComponent,
        OrderCreateComponent,
        OrderListComponent,
        InvoiceShowComponent,
    ]
})
export class ProductWizardModule { }

