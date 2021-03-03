import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { VENDOR_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { NewVendorProductComponent } from './views/new-vendor-product/new-vendor-product.component';
import { VendorProductComponent } from './views/vendor-product/vendor-product.component';
import { AssignedDistributorProductComponent } from './views/assigned-distributor-product/assigned-distributor-product.component';
import { TelemetricComponent } from '../telemetric-data/views/telemetric/telemetric.component';
import { ErrorDataComponent } from '../telemetric-data/views/error-data/error-data.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { AllVendorProductComponent} from './views/all-vendor-product/all-vendor-product.component';
import { VendorSubscriptionListComponent } from './views/vendor-subscription-list/vendor-subscription-list.component';
import { VendorSubscriptionEditComponent } from './views/vendor-subscription-edit/vendor-subscription-edit.component';

const vendorRoutes: Routes = [
    { path: VENDOR_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.NEW_VENDOR_PRODUCT, component: NewVendorProductComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.VENDOR_PRODUCT, component: VendorProductComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.ALL_VENDOR_PRODUCT, component: AllVendorProductComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.ASSIGNED_DISTRIBUTOR_PRODUCT, component: AssignedDistributorProductComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.ASSIGNED_COMPANY_PRODUCT, component: AssignedCompanyProductComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.VENDOR_SUBSCRIPTION_LIST, component: VendorSubscriptionListComponent,canActivate: [AuthGuard] },
    { path: VENDOR_CONSTANTS.LINK.VENDOR_SUBSCRIPTION_EDIT, component: VendorSubscriptionEditComponent,canActivate: [AuthGuard] }
]


@NgModule({
    imports: [RouterModule.forChild(vendorRoutes)],
    exports: [RouterModule]
})
export class VendorRoutingModule {}
