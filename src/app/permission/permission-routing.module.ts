import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleModule} from './role/role.module';
import { FeatureCategoryModule} from './feature-category/feature-category.module';

import { PERMISSION_CONSTANTS } from './constants';

const permissionRoutes: Routes = [
    { path: PERMISSION_CONSTANTS.LINK.FEATURE_CATEGORY, loadChildren: () => FeatureCategoryModule },
    { path: PERMISSION_CONSTANTS.LINK.ROLE, loadChildren: () => RoleModule }
];

@NgModule({
    imports: [RouterModule.forChild(permissionRoutes)],
    exports: [RouterModule]
})
export class PermissionRoutingModule {}
