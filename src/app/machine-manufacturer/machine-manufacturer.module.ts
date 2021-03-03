import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { NewManufacturerProductComponent } from './views/new-manufacturer-product/new-manufacturer-product.component';
import { ManufacturerProductComponent } from './views/manufacturer-product/manufacturer-product.component';
import { AssignManufacturerProductModalComponent } from './views/assign-manufacturer-product-modal/assign-manufacturer-product-modal.component';
import { MachineManufacturerService} from './services/machine-manufacturer.service';
import { MachineManufacturerProductService} from './services/machine-manufacturer-product.service';
import { MachineManufacturerRoutingModule } from './machine-manufacturer-routing.module';
import { ListMachineComponent } from './views/list-machine/list-machine.component';


@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewManufacturerProductComponent,
        ManufacturerProductComponent,
        AssignManufacturerProductModalComponent,
        ChangePasswordComponent,
        ListMachineComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        ReactiveFormsModule,
        LayoutModule,
        PerfectScrollbarModule,
        MachineManufacturerRoutingModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewManufacturerProductComponent,
        ManufacturerProductComponent,
        AssignManufacturerProductModalComponent,
        ChangePasswordComponent,
        ListMachineComponent
    ],

    providers: [MachineManufacturerService , MachineManufacturerProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewManufacturerProductComponent,
        ManufacturerProductComponent,
        AssignManufacturerProductModalComponent,
        ChangePasswordComponent,
        ListMachineComponent
    ]
})
export class MachineManufacturerModule { }
