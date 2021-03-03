import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProductComponent } from './views/create-product/create-product.component';
import { ProductOrderCreateComponent } from './views/product-order-create/product-order-create.component';
import { OrderCreateComponent } from './views/order-create/order-create.component';
import { OrderListComponent } from './views/order-list/order-list.component';
import { InvoiceShowComponent } from './views/invoice-show/invoice-show.component';
import { PRODUCT_WIZARD_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const productWizardRoutes: Routes = [

    { path: PRODUCT_WIZARD_CONSTANTS.LINK.CREATE_PRODUCT, component: CreateProductComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_WIZARD_CONSTANTS.LINK.CREATE_PRODUCT_ALIAS, component: CreateProductComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_WIZARD_CONSTANTS.LINK.PRODUCT_ORDER_CREATE, component: ProductOrderCreateComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_WIZARD_CONSTANTS.LINK.ORDER_CREATE, component: OrderCreateComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_WIZARD_CONSTANTS.LINK.ORDER_LIST, component: OrderListComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_WIZARD_CONSTANTS.LINK.INVOICE_SHOW, component: InvoiceShowComponent,canActivate: [AuthGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(productWizardRoutes)],
    exports: [RouterModule]
})
export class ProductWizardRoutingModule {}
