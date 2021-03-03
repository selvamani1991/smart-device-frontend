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
import { ClientService } from './services/client.service';
import { ClientProductService} from './services/client-product.service';
import { ClientRoutingModule } from './client-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { MachineProductTypeShowComponent } from './views/machine-productType-show/machine-productType-show.component';
import { NewClientProductComponent } from './views/new-client-product/new-client-product.component';
import { MachineProductTypeComponent } from './views/machine-productType/machine-productType.component';
import { ClientProductComponent } from './views/client-product/client-product.component';
import { CompanyAssignModalComponent } from './views/company-assign-modal/company-assign-modal.component';
import { VendorAssignModalComponent } from './views/vendor-assign-modal/vendor-assign-modal.component';
import { CityModule} from '../city/city.module';
import { NewProductTypeListComponent } from './views/new-product-type-list/new-product-type-list.component';
import { BoardManufacturerModalComponent } from './views/board-manufacturer-modal/board-manufacturer-modal.component';
import { MachineModalComponent } from './views/machine-modal/machine-modal.component';
import { AssignedVendorProductComponent } from './views/assigned-vendor-product/assigned-vendor-product.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ListProductComponent } from './views/list-product/list-product.component';
import { MachineModule} from '../machine/machine.module';
import { ClientSubscriptionListComponent } from './views/client-subscription-list/client-subscription-list.component';
import { ClientSubscriptionEditComponent } from './views/client-subscription-edit/client-subscription-edit.component';
import { ClientSubscriptionModalComponent } from './views/client-subscription-modal/client-subscription-modal.component';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewClientProductComponent,
        ClientProductComponent,
        CompanyAssignModalComponent,
        VendorAssignModalComponent,
        NewProductTypeListComponent,
        BoardManufacturerModalComponent,
        MachineModalComponent,
        MachineProductTypeComponent,
        MachineProductTypeShowComponent,
        AssignedVendorProductComponent,
        AssignedCompanyProductComponent,
        ChangePasswordComponent,
        ListProductComponent,
        ClientSubscriptionListComponent,
        ClientSubscriptionModalComponent,
        ClientSubscriptionEditComponent
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
        ClientRoutingModule,
        CityModule,
        MachineModule,
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewClientProductComponent,
        ClientProductComponent,
        CompanyAssignModalComponent,
        VendorAssignModalComponent,
        NewProductTypeListComponent,
        BoardManufacturerModalComponent,
        MachineModalComponent,
        MachineProductTypeComponent,
        MachineProductTypeShowComponent,
        AssignedVendorProductComponent,
        AssignedCompanyProductComponent,
        ChangePasswordComponent,
        ListProductComponent,
        ClientSubscriptionListComponent,
        ClientSubscriptionModalComponent,
        ClientSubscriptionEditComponent
    ],

    providers: [ClientService, ClientProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewClientProductComponent,
        ClientProductComponent,
        CompanyAssignModalComponent,
        VendorAssignModalComponent,
        NewProductTypeListComponent,
        BoardManufacturerModalComponent,
        MachineModalComponent,
        MachineProductTypeComponent,
        MachineProductTypeShowComponent,
        AssignedVendorProductComponent,
        AssignedCompanyProductComponent,
        ChangePasswordComponent,
        ListProductComponent,
        ClientSubscriptionListComponent,
        ClientSubscriptionModalComponent,
        ClientSubscriptionEditComponent

    ]
})
export class ClientModule { }
