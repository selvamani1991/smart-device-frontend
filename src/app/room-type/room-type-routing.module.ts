import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ROOM_TYPE_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const roomTypeRoutes: Routes = [
    { path: ROOM_TYPE_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: ROOM_TYPE_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: ROOM_TYPE_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: ROOM_TYPE_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(roomTypeRoutes)],
    exports: [RouterModule]
})

export class RoomTypeRoutingModule {}
