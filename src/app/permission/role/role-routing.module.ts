﻿import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../auth/services/auth.guard';

import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent, } from './views/create/create.component';
import { EditComponent} from './views/edit/edit.component';

import { ROLE_CONSTANTS } from './constants';


const roleRoutes: Routes = [
    { path: ROLE_CONSTANTS.LINK.LIST,  component: ListComponent, canActivate: [AuthGuard] },
    { path: ROLE_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: ROLE_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: ROLE_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] }

];


@NgModule({
    imports: [RouterModule.forChild(roleRoutes)],
    exports: [RouterModule]
})
export class RoleRoutingModule {}
