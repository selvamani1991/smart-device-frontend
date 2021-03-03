import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { DISTRIBUTOR_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { NewDistributorProductComponent } from './views/new-distributor-product/new-distributor-product.component';
import { DistributorProductComponent } from './views/distributor-product/distributor-product.component';
import { AssignedCompanyProductComponent } from './views/assigned-company-product/assigned-company-product.component';
import { AllDistributorProductComponent} from './views/all-distributor-product/all-distributor-product.component';
import { TelemetricComponent } from '../telemetric-data/views/telemetric/telemetric.component';
import { ErrorDataComponent } from '../telemetric-data/views/error-data/error-data.component';
import { DistributorSubscriptionListComponent } from './views/distributor-subscription-list/distributor-subscription-list.component';
import { DistributorSubscriptionEditComponent } from './views/distributor-subscription-edit/distributor-subscription-edit.component';

const distributorRoutes: Routes = [
    { path: DISTRIBUTOR_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.NEW_DISTRIBUTOR_PRODUCT, component: NewDistributorProductComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.DISTRIBUTOR_PRODUCT, component: DistributorProductComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.ALL_DISTRIBUTOR_PRODUCT, component: AllDistributorProductComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.ASSIGNED_COMPANY_PRODUCT, component: AssignedCompanyProductComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.DISTRIBUTOR_SUBSCRIPTION_LIST, component: DistributorSubscriptionListComponent, canActivate: [AuthGuard] },
    { path: DISTRIBUTOR_CONSTANTS.LINK.DISTRIBUTOR_SUBSCRIPTION_EDIT, component: DistributorSubscriptionEditComponent, canActivate: [AuthGuard] }
];


@NgModule({
    imports: [RouterModule.forChild(distributorRoutes)],
    exports: [RouterModule]
})
export class DistributorRoutingModule {}
