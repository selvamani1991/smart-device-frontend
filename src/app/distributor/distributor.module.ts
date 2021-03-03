import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { DistributorService } from './services/distributor.service';
import { DistributorProductService } from './services/distributor-product.service';
import { DistributorRoutingModule } from './distributor-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewDistributorProductComponent } from './views/new-distributor-product/new-distributor-product.component';
import { DistributorProductComponent } from './views/distributor-product/distributor-product.component';
import { CompanyTypeModalComponent } from './views/company-type-modal/company-type-modal.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { AllDistributorProductComponent} from './views/all-distributor-product/all-distributor-product.component';
import { TelemetricDataModule} from '../telemetric-data/telemetric-data.module';
import { DistributorSubscriptionListComponent } from './views/distributor-subscription-list/distributor-subscription-list.component';
import { DistributorSubscriptionEditComponent } from './views/distributor-subscription-edit/distributor-subscription-edit.component';
import { DistributorSubscriptionModalComponent } from './views/distributor-subscription-modal/distributor-subscription-modal.component';


@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        NewDistributorProductComponent,
        DistributorProductComponent,
        ShowComponent,
        AssignedCompanyProductComponent,
        AllDistributorProductComponent,
        CompanyTypeModalComponent,
        ChangePasswordComponent,
        DistributorSubscriptionModalComponent,
        DistributorSubscriptionListComponent,
        DistributorSubscriptionEditComponent
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
        DistributorRoutingModule,
        ReactiveFormsModule,
        TelemetricDataModule
    ],
    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        NewDistributorProductComponent,
        DistributorProductComponent,
        ShowComponent,
        AssignedCompanyProductComponent,
        AllDistributorProductComponent,
        CompanyTypeModalComponent,
        ChangePasswordComponent,
        DistributorSubscriptionModalComponent,
        DistributorSubscriptionListComponent,
        DistributorSubscriptionEditComponent
    ],

    providers: [DistributorService, DistributorProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewDistributorProductComponent,
        DistributorProductComponent,
        AssignedCompanyProductComponent,
        CompanyTypeModalComponent,
        AllDistributorProductComponent,
        ChangePasswordComponent,
        DistributorSubscriptionModalComponent,
        DistributorSubscriptionListComponent,
        DistributorSubscriptionEditComponent
    ]
})
export class DistributorModule { }
