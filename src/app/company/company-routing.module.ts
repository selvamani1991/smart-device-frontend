import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CompanyProductComponent } from './views/company-product/company-product.component';
import { NewCompanyProductComponent } from './views/new-company-product/new-company-product.component';
import { AllCompanyProductComponent} from './views/all-company-product/all-company-product.component';
import { AssignedCompanyBuildingProductComponent} from './views/assigned-company-building-product/assigned-company-building-product.component';
import { COMPANY_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { TelemetricComponent } from '../telemetric-data/views/telemetric/telemetric.component';
import { ErrorDataComponent } from '../telemetric-data/views/error-data/error-data.component';
import { SubscriptionListComponent } from './views/subscription-list/subscription-list.component';
import { SubscriptionEditComponent } from './views/subscription-edit/subscription-edit.component';

const companyRoutes: Routes = [
    { path: COMPANY_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.COMPANY_PRODUCT, component: CompanyProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.NEW_COMPANY_PRODUCT, component: NewCompanyProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.ALL_COMPANY_PRODUCT, component: AllCompanyProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.ASSIGNED_COMPANY_BUILDING_PRODUCT, component: AssignedCompanyBuildingProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.SUBSCRIPTION_LIST, component: SubscriptionListComponent, canActivate: [AuthGuard] },
    { path: COMPANY_CONSTANTS.LINK.SUBSCRIPTION_EDIT, component: SubscriptionEditComponent, canActivate: [AuthGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(companyRoutes)],
    exports: [RouterModule]
})

export class CompanyRoutingModule { }
