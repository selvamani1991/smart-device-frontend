﻿import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';

import { FEATURE_CATEGORY_CONSTANTS } from './constants';

import { AuthGuard } from '../../auth/services/auth.guard';

const featureCategoryRoutes: Routes = [
    { path: FEATURE_CATEGORY_CONSTANTS.LINK.LIST,  component: ListComponent, canActivate: [AuthGuard] },
    { path: FEATURE_CATEGORY_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: FEATURE_CATEGORY_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: FEATURE_CATEGORY_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] }
];


@NgModule({
    imports: [RouterModule.forChild(featureCategoryRoutes)],
    exports: [RouterModule]
})
export class FeatureCategoryRoutingModule {}
