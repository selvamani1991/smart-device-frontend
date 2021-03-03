import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { COMPANY_BUILDING_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { NewCompanyBuildingProductComponent } from './views/new-company-building-product/new-company-building-product.component';
import { AllCompanyBuildingProductComponent} from './views/all-company-building-product/all-company-building-product.component';
import { CompanyBuildingProductComponent } from './views/company-building-product/company-building-product.component';
import { TelemetricComponent } from '../telemetric-data/views/telemetric/telemetric.component';
import { ErrorDataComponent } from '../telemetric-data/views/error-data/error-data.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

const companyBuildingRoutes: Routes = [
    { path: COMPANY_BUILDING_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.COMPANY_BUILDING_PRODUCT, component: CompanyBuildingProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.ALL_COMPANY_BUILDING_PRODUCT, component: AllCompanyBuildingProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.NEW_COMPANY_BUILDING_PRODUCT, component: NewCompanyBuildingProductComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent, canActivate: [AuthGuard] },
    { path: COMPANY_BUILDING_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(companyBuildingRoutes)],
    exports: [RouterModule]
})
export class CompanyBuildingRoutingModule {}
