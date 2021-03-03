import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { NewManufacturerProductComponent } from './views/new-manufacturer-product/new-manufacturer-product.component';
import { ManufacturerProductComponent } from './views/manufacturer-product/manufacturer-product.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ListMachineComponent } from './views/list-machine/list-machine.component';
import { MACHINE_MANUFACTURER_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const machineManufacturerRoutes: Routes = [
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.NEW_MANUFACTURER_PRODUCT, component: NewManufacturerProductComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.MANUFACTURER_PRODUCT, component: ManufacturerProductComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] },
      { path: MACHINE_MANUFACTURER_CONSTANTS.LINK.LIST_MACHINE, component: ListMachineComponent, canActivate: [AuthGuard] }
];
@NgModule({
    imports: [RouterModule.forChild(machineManufacturerRoutes)],
    exports: [RouterModule]
})
export class MachineManufacturerRoutingModule {}
