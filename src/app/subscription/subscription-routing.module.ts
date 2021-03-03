import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { SUBSCRIPTION_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const subscriptionRoutes: Routes = [
    { path: SUBSCRIPTION_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: SUBSCRIPTION_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: SUBSCRIPTION_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: SUBSCRIPTION_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(subscriptionRoutes)],
    exports: [RouterModule]
})

export class SubscriptionRoutingModule {}
