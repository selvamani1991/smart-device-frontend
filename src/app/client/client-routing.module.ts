import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { CLIENT_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { NewClientProductComponent } from './views/new-client-product/new-client-product.component';
import { MachineProductTypeComponent } from './views/machine-productType/machine-productType.component';
import { ClientProductComponent } from './views/client-product/client-product.component';
import { NewProductTypeListComponent } from './views/new-product-type-list/new-product-type-list.component';
import { MachineProductTypeShowComponent } from './views/machine-productType-show/machine-productType-show.component';
import { AssignedVendorProductComponent } from './views/assigned-vendor-product/assigned-vendor-product.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { MachineListComponent } from '../machine/views/machine-list/machine-list.component';
import { ListProductComponent } from './views/list-product/list-product.component';
import { ClientSubscriptionListComponent } from './views/client-subscription-list/client-subscription-list.component';
import { ClientSubscriptionEditComponent } from './views/client-subscription-edit/client-subscription-edit.component';

const clientRoutes: Routes = [
    { path: CLIENT_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.MACHINE_PRODUCT_TYPE_SHOW, component: MachineProductTypeShowComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.NEW_CLIENT_PRODUCT, component: NewClientProductComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.CLIENT_PRODUCT, component: ClientProductComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.NEW_PRODUCT_TYPE_LIST, component: NewProductTypeListComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.MACHINE_PRODUCT_TYPE, component: MachineProductTypeComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.ASSIGNED_VENDOR_PRODUCT, component: AssignedVendorProductComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.ASSIGNED_COMPANY_PRODUCT, component: AssignedCompanyProductComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.PRODUCT_TYPE_MACHINE, component: MachineListComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.LIST_PRODUCT, component: ListProductComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.CLIENT_SUBSCRIPTION_LIST, component: ClientSubscriptionListComponent, canActivate: [AuthGuard] },
    { path: CLIENT_CONSTANTS.LINK.CLIENT_SUBSCRIPTION_EDIT, component: ClientSubscriptionEditComponent, canActivate: [AuthGuard] },

]

@NgModule({
    imports: [RouterModule.forChild(clientRoutes)],
    exports: [RouterModule]
})
export class ClientRoutingModule {}