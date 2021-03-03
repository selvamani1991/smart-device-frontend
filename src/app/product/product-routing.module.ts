import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './views/product-list/product-list.component';
import { ProductDataListComponent } from './views/product-data-list/product-data-list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { PRODUCT_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { VendorProductComponent } from '../vendor/views/vendor-product/vendor-product.component';
import { CompanyProductComponent } from '../company/views/company-product/company-product.component';
import { DistributorProductComponent } from '../distributor/views/distributor-product/distributor-product.component';
import { CompanyBuildingProductComponent } from '../company-building/views/company-building-product/company-building-product.component';
import { TelemetricComponent } from '../telemetric-data/views/telemetric/telemetric.component';
import { ErrorDataComponent } from '../telemetric-data/views/error-data/error-data.component';


const productRoutes: Routes = [
    { path: PRODUCT_CONSTANTS.LINK.PRODUCT_LIST, component: ProductListComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.PRODUCT_DATA_LIST, component: ProductDataListComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.ASSIGNED_VENDOR_PRODUCT, component: VendorProductComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.ASSIGNED_COMPANY_PRODUCT, component: CompanyProductComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.ASSIGNED_DISTRIBUTOR_PRODUCT, component: DistributorProductComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.ASSIGNED_COMPANY_BUILDING_PRODUCT, component: CompanyBuildingProductComponent, canActivate: [AuthGuard] },

    { path: PRODUCT_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricComponent, canActivate: [AuthGuard] },
    { path: PRODUCT_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent, canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(productRoutes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {}
