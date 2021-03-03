import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineListComponent } from './views/machine-list/machine-list.component';
import { CreateComponent } from './views/create/create.component';
import { MACHINE_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

const machineRoutes: Routes = [
    { path: MACHINE_CONSTANTS.LINK.MACHINE_LIST, component: MachineListComponent, canActivate: [AuthGuard] },
    { path: MACHINE_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: MACHINE_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: MACHINE_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(machineRoutes)],
    exports: [RouterModule]
})

export class MachineRoutingModule {}
