import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CompanyComponent } from './views/company/company.component';
import { CompanyBuildingComponent } from './views/company-building/company-building.component';
import { VendorComponent } from './views/vendor/vendor.component';
import { DistributorComponent } from './views/distributor/distributor.component';
import { ClientVendorComponent } from './views/client-vendor/client-vendor.component';
import { VendorErrorComponent } from './views/vendor-error/vendor-error.component';
import { CompanyErrorComponent } from './views/company-error/company-error.component';
import { ClientCompanyComponent } from './views/client-company/client-company.component';
import { VendorCompanyComponent } from './views/vendor-company/vendor-company.component';
import { ReportService } from './services/report.service';
import { ReportRoutingModule } from './report-routing.module';
import { CityModule} from '../city/city.module';
import { MachineModule} from '../machine/machine.module';
import { ProductModule} from '../product/product.module';


@NgModule({
    declarations: [
        CompanyComponent,
        CompanyBuildingComponent,
        VendorComponent,
        ClientVendorComponent,
        DistributorComponent,
        ClientCompanyComponent,
        VendorErrorComponent,
        CompanyErrorComponent,
        VendorCompanyComponent
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
        ReportRoutingModule,
        CityModule,
        MachineModule,
        ProductModule
    ],

    exports: [
        CompanyComponent,
        CompanyBuildingComponent,
        VendorComponent,
        DistributorComponent,
        ClientVendorComponent,
        ClientCompanyComponent,
        VendorErrorComponent,
        CompanyErrorComponent,
        VendorCompanyComponent
    ],

    providers: [ReportService],
    bootstrap: [
        CompanyComponent,
        CompanyBuildingComponent,
        VendorComponent,
        DistributorComponent,
        ClientVendorComponent,
        ClientCompanyComponent,
        VendorErrorComponent,
        CompanyErrorComponent,
        VendorCompanyComponent

    ]
})
export class ReportModule { }