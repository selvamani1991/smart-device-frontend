import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ConsumerProductListComponent } from '../consumer-product/views/consumer-product-list/consumer-product-list.component';
import { CONSUMER_PRODUCT_TYPE_CONSTANTS } from './constants';
import { AuthGuard } from '../../auth/services/auth.guard';

const consumerProductTypeRoutes: Routes = [
    { path: CONSUMER_PRODUCT_TYPE_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_TYPE_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_TYPE_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_TYPE_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_TYPE_CONSTANTS.LINK.CONSUMER_PRODUCT_LIST, component: ConsumerProductListComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(consumerProductTypeRoutes)],
    exports: [RouterModule]
})

export class ConsumerProductTypeRoutingModule {}
