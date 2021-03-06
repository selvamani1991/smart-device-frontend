import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PRODUCT_SUBSCRIPTION_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

const productSubscriptionRoutes: Routes = [
    { path: PRODUCT_SUBSCRIPTION_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_SUBSCRIPTION_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_SUBSCRIPTION_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_SUBSCRIPTION_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] }


];

@NgModule({
    imports: [RouterModule.forChild(productSubscriptionRoutes)],
    exports: [RouterModule]
})
export class ProductSubscriptionRoutingModule {}