import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { USER_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const userRoutes: Routes = [
    { path: USER_CONSTANTS.LINK.LIST,  component: ListComponent,canActivate: [AuthGuard] },
    { path: USER_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] },
    { path: USER_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: USER_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: USER_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent,canActivate: [AuthGuard] }
]


@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
