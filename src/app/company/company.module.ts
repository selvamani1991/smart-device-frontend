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
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CompanyProductComponent} from './views/company-product/company-product.component';
import { NewCompanyProductComponent} from './views/new-company-product/new-company-product.component';
import { CompanyBuildingModalComponent} from './views/company-building-modal/company-building-modal.component';
import { EditCompanyBuildingModalComponent} from './views/edit-company-building-modal/edit-company-building-modal.component';
import { AssignedCompanyBuildingProductComponent} from './views/assigned-company-building-product/assigned-company-building-product.component';
import { AllCompanyProductComponent} from './views/all-company-product/all-company-product.component';
import { CompanyService } from './services/company.service';
import { CompanyProductService } from './services/company-product.service';
import { CompanyRoutingModule } from './company-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetricDataModule} from '../telemetric-data/telemetric-data.module';
import { SubscriptionListComponent } from './views/subscription-list/subscription-list.component';
import { SubscriptionEditComponent } from './views/subscription-edit/subscription-edit.component';
import { CompanySubscriptionModalComponent } from './views/company-subscription-modal/company-subscription-modal.component';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        CompanyProductComponent,
        NewCompanyProductComponent,
        CompanyBuildingModalComponent,
        AllCompanyProductComponent,
        AssignedCompanyBuildingProductComponent,
        ChangePasswordComponent,
        CompanySubscriptionModalComponent,
        SubscriptionListComponent,
        SubscriptionEditComponent,
        EditCompanyBuildingModalComponent,
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
        CompanyRoutingModule,
        ReactiveFormsModule,
        TelemetricDataModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        CompanyProductComponent,
        NewCompanyProductComponent,
        CompanyBuildingModalComponent,
        AllCompanyProductComponent,
        AssignedCompanyBuildingProductComponent,
        ChangePasswordComponent,
        CompanySubscriptionModalComponent,
        SubscriptionListComponent,
        SubscriptionEditComponent,
        EditCompanyBuildingModalComponent,
    ],

    providers: [CompanyService , CompanyProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        CompanyProductComponent,
        NewCompanyProductComponent,
        CompanyBuildingModalComponent,
        AllCompanyProductComponent,
        AssignedCompanyBuildingProductComponent,
        ChangePasswordComponent,
        CompanySubscriptionModalComponent,
        SubscriptionListComponent,
        SubscriptionEditComponent,
        EditCompanyBuildingModalComponent,
    ]
})
export class CompanyModule { }

