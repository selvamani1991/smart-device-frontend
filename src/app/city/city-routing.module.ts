import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { CITY_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

const cityRoutes: Routes = [
    { path: CITY_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: CITY_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: CITY_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: CITY_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] }
  
]

@NgModule({
    imports: [RouterModule.forChild(cityRoutes)],
    exports: [RouterModule]
})
export class CityRoutingModule {}
