import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerProductListComponent } from './views/consumer-product-list/consumer-product-list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ProductShowComponent } from './views/product-show/product-show.component';
import { CONSUMER_PRODUCT_CONSTANTS } from './constants';
import { AuthGuard } from '../../auth/services/auth.guard';

const consumerProductRoutes: Routes = [
    { path: CONSUMER_PRODUCT_CONSTANTS.LINK.CONSUMER_PRODUCT_LIST, component: ConsumerProductListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_PRODUCT_CONSTANTS.LINK.PRODUCT_SHOW, component: ProductShowComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(consumerProductRoutes)],
    exports: [RouterModule]
})

export class ConsumerProductRoutingModule {}
