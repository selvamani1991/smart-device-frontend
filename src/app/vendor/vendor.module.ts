import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TranslateModule}       from '@ngx-translate/core';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VendorService } from './services/vendor.service';
import { VendorProductService } from './services/vendor-product.service';
import { VendorRoutingModule }   from './vendor-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { NewVendorProductComponent } from './views/new-vendor-product/new-vendor-product.component';
import { VendorProductComponent } from './views/vendor-product/vendor-product.component';
import { DistributorTypeModalComponent } from './views/distributor-type-modal/distributor-type-modal.component';
import { CompanyTypeModalComponent } from './views/company-type-modal/company-type-modal.component';
import { AssignedDistributorProductComponent } from './views/assigned-distributor-product/assigned-distributor-product.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { AllVendorProductComponent} from './views/all-vendor-product/all-vendor-product.component';
import { DistributorModule} from '../distributor/distributor.module';
import { TelemetricDataModule} from '../telemetric-data/telemetric-data.module';
import { VendorSubscriptionModalComponent } from './views/vendor-subscription-modal/vendor-subscription-modal.component';
import { VendorSubscriptionListComponent } from './views/vendor-subscription-list/vendor-subscription-list.component';
import { VendorSubscriptionEditComponent } from './views/vendor-subscription-edit/vendor-subscription-edit.component';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewVendorProductComponent,
        VendorProductComponent,
        DistributorTypeModalComponent,
        AssignedDistributorProductComponent,
        CompanyTypeModalComponent,
        ChangePasswordComponent,
        AllVendorProductComponent,
        AssignedCompanyProductComponent,
        VendorSubscriptionModalComponent,
        VendorSubscriptionListComponent,
        VendorSubscriptionEditComponent
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
        VendorRoutingModule,
        ReactiveFormsModule,
        DistributorModule,
        TelemetricDataModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewVendorProductComponent,
        VendorProductComponent,
        DistributorTypeModalComponent,
        AssignedDistributorProductComponent,
        CompanyTypeModalComponent,
        ChangePasswordComponent,
        AllVendorProductComponent,
        AssignedCompanyProductComponent,
        VendorSubscriptionModalComponent,
        VendorSubscriptionListComponent,
        VendorSubscriptionEditComponent
    ],

    providers: [VendorService,VendorProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewVendorProductComponent,
        VendorProductComponent,
        DistributorTypeModalComponent,
        CompanyTypeModalComponent,
        AssignedDistributorProductComponent,
        AllVendorProductComponent,
        ChangePasswordComponent,
        AssignedCompanyProductComponent,
        VendorSubscriptionModalComponent,
        VendorSubscriptionListComponent,
        VendorSubscriptionEditComponent
    ]
})
export class VendorModule { }

