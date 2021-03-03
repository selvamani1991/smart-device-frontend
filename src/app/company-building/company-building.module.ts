import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { CompanyBuildingService } from './services/company-building.service';
import { CompanyBuildingProductService } from './services/company-building-product.service';
import { CompanyBuildingRoutingModule } from './company-building-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { CompanyBuildingProductComponent} from './views/company-building-product/company-building-product.component';
import { AssignCompanyBuildingModalComponent} from './views/assign-company-building-modal/assign-company-building-modal.component';
import { NewCompanyBuildingProductComponent} from './views/new-company-building-product/new-company-building-product.component';
import { AllCompanyBuildingProductComponent} from './views/all-company-building-product/all-company-building-product.component';
import { CityModule} from '../city/city.module';
import { TelemetricDataModule} from '../telemetric-data/telemetric-data.module';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        CompanyBuildingProductComponent,
        AssignCompanyBuildingModalComponent,
        NewCompanyBuildingProductComponent,
        AllCompanyBuildingProductComponent,
        ChangePasswordComponent
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
        CompanyBuildingRoutingModule,
        CityModule,
        TelemetricDataModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        CompanyBuildingProductComponent,
        NewCompanyBuildingProductComponent,
        ShowComponent,
        AssignCompanyBuildingModalComponent,
        AllCompanyBuildingProductComponent,
        ChangePasswordComponent
    ],

    providers: [CompanyBuildingService , CompanyBuildingProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        CompanyBuildingProductComponent,
        NewCompanyBuildingProductComponent,
        EditComponent,
        ShowComponent,
        AssignCompanyBuildingModalComponent,
        AllCompanyBuildingProductComponent,
        ChangePasswordComponent
    ]
})
export class CompanyBuildingModule { }
