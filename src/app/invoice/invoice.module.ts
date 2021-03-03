import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CompanyShowComponent } from './views/company-show/company-show.component';
import { VendorShowComponent } from './views/vendor-show/vendor-show.component';
import { DistributorShowComponent } from './views/distributor-show/distributor-show.component';
import { VendorPrintComponent } from './views/vendor-print/vendor-print.component';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { CityModule} from '../city/city.module';
import { VendorModule} from '../vendor/vendor.module';
import { CompanyModule} from '../company/company.module';
import { ClientModule} from '../client/client.module';
import { MachineModule} from '../machine/machine.module';
import { ProductModule} from '../product/product.module';
import { InvoiceVendorSubscriptionModalComponent } from './views/invoice-vendor-subscription-modal/invoice-vendor-subscription-modal.component';
import { InvoiceCompanySubscriptionModalComponent } from './views/invoice-company-subscription-modal/invoice-company-subscription-modal.component';
import { InvoiceDistributorSubscriptionModalComponent } from './views/invoice-distributor-subscription-modal/invoice-distributor-subscription-modal.component';

@NgModule({
    declarations: [
        CompanyShowComponent,
        VendorShowComponent,
        DistributorShowComponent,
        InvoiceVendorSubscriptionModalComponent,
        InvoiceCompanySubscriptionModalComponent,
        InvoiceDistributorSubscriptionModalComponent,
        VendorPrintComponent

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
        PerfectScrollbarModule,
        InvoiceRoutingModule,
        CityModule,
        MachineModule,
        ProductModule,
        VendorModule,
        ClientModule,
        CompanyModule
    ],

    exports: [
        CompanyShowComponent,
        VendorShowComponent,
        DistributorShowComponent,
        InvoiceVendorSubscriptionModalComponent,
        InvoiceCompanySubscriptionModalComponent,
        InvoiceDistributorSubscriptionModalComponent,
        VendorPrintComponent



    ],

    providers: [InvoiceService],
    bootstrap: [
        CompanyShowComponent,
        VendorShowComponent,
        DistributorShowComponent,
        InvoiceVendorSubscriptionModalComponent,
        InvoiceCompanySubscriptionModalComponent,
        InvoiceDistributorSubscriptionModalComponent,
        VendorPrintComponent


    ]
})
export class InvoiceModule { }
