import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZONE_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

const zoneRoutes: Routes = [
    { path: ZONE_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: ZONE_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: ZONE_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: ZONE_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(zoneRoutes)],
    exports: [RouterModule]
})
export class ZoneRoutingModule {}
