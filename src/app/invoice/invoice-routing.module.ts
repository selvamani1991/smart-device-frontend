import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { INVOICE_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { CompanyShowComponent } from './views/company-show/company-show.component';
import { VendorShowComponent } from './views/vendor-show/vendor-show.component';
import { DistributorShowComponent } from './views/distributor-show/distributor-show.component';
import { VendorPrintComponent } from './views/vendor-print/vendor-print.component';

const invoiceRoutes: Routes = [
    { path: INVOICE_CONSTANTS.LINK.COMPANY_SHOW, component: CompanyShowComponent, canActivate: [AuthGuard] },
    { path: INVOICE_CONSTANTS.LINK.VENDOR_SHOW, component: VendorShowComponent, canActivate: [AuthGuard] },
    { path: INVOICE_CONSTANTS.LINK.DISTRIBUTOR_SHOW, component: DistributorShowComponent, canActivate: [AuthGuard] },
    { path: INVOICE_CONSTANTS.LINK.VENDOR_PRINT, component: VendorPrintComponent, canActivate: [AuthGuard] },


];

@NgModule({
    imports: [RouterModule.forChild(invoiceRoutes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule {}
