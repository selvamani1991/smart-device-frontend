import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ProductListComponent } from './views/product-list/product-list.component';
import { ProductDataListComponent } from './views/product-data-list/product-data-list.component';
import { CreateComponent } from './views/create/create.component';
import { ShowComponent } from './views/show/show.component';
import { EditComponent } from './views/edit/edit.component';
import { ProductService } from './services/product.service';
import { ProductRoutingModule } from './product-routing.module';
import { ClientModule} from '../client/client.module';
import { VendorModule} from '../vendor/vendor.module';
import { CompanyModule} from '../company/company.module';
import { DistributorModule} from '../distributor/distributor.module';
import { CompanyBuildingModule} from '../company-building/company-building.module';
import { TelemetricDataModule} from '../telemetric-data/telemetric-data.module';
import { GraphModalComponent } from './views/graph-modal/graph-modal.component';
import { DownloadModalComponent } from './views/download-modal/download-modal.component';
import { QrModalComponent } from './views/qr-modal/qr-modal.component';


@NgModule({
    declarations: [
        ProductListComponent,
        ProductDataListComponent,
        ShowComponent,
        EditComponent,
        CreateComponent,
        GraphModalComponent,
        DownloadModalComponent,
        QrModalComponent,

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
        ProductRoutingModule,
        ClientModule,
        VendorModule,
        CompanyModule,
        DistributorModule,
        CompanyBuildingModule,
        TelemetricDataModule
    ],

    exports: [
        ProductListComponent,
        ProductDataListComponent,
        ShowComponent,
        EditComponent,
        ShowComponent,
        CreateComponent,
        GraphModalComponent,
        DownloadModalComponent,
        QrModalComponent,

    ],

    providers: [ProductService],
    bootstrap: [
        ProductListComponent,
        ProductDataListComponent,
        ShowComponent,
        EditComponent,
        ShowComponent,
        CreateComponent,
        GraphModalComponent,
        DownloadModalComponent,
        QrModalComponent,

    ]
})
export class ProductModule { }

