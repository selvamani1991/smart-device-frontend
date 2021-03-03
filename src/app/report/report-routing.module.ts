import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { REPORT_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { CompanyComponent } from './views/company/company.component';
import { CompanyBuildingComponent } from './views/company-building/company-building.component';
import { VendorComponent } from './views/vendor/vendor.component';
import { ClientVendorComponent } from './views/client-vendor/client-vendor.component';
import { DistributorComponent } from './views/distributor/distributor.component';
import { ClientCompanyComponent } from './views/client-company/client-company.component';
import { VendorErrorComponent } from './views/vendor-error/vendor-error.component';
import { CompanyErrorComponent } from './views/company-error/company-error.component';
import { VendorCompanyComponent } from './views/vendor-company/vendor-company.component';

const reportRoutes: Routes = [
    { path: REPORT_CONSTANTS.LINK.COMPANY, component: CompanyComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.COMPANY_BUILDING, component: CompanyBuildingComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.VENDOR, component: VendorComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.DISTRIBUTOR, component: DistributorComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.CLIENT_VENDOR, component: ClientVendorComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.CLIENT_COMPANY, component: ClientCompanyComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.VENDOR_ERROR, component: VendorErrorComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.COMPANY_ERROR, component: CompanyErrorComponent,canActivate: [AuthGuard] },
    { path: REPORT_CONSTANTS.LINK.VENDOR_COMPANY, component: VendorCompanyComponent,canActivate: [AuthGuard] },

]

@NgModule({
    imports: [RouterModule.forChild(reportRoutes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {}