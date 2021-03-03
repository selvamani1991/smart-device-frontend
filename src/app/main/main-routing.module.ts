import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { Page404Component } from './views/page404/page404.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ConsumerDashboardComponent } from './views/consumer-dashboard/consumer-dashboard.component';
import { ClientDashboardComponent } from './views/client-dashboard/client-dashboard.component';
import { AuthGuard } from '../auth/services/auth.guard';
import { MAIN_CONSTANTS } from './constants';

const mainRoutes: Routes = [
    { path: MAIN_CONSTANTS.LINK.DASHBOARD, component: DashboardComponent, canActivate: [AuthGuard] },
    { path: MAIN_CONSTANTS.LINK.HOME, component: HomeComponent },
    { path: MAIN_CONSTANTS.LINK.PAGE404, component: Page404Component },
    { path: MAIN_CONSTANTS.LINK.CONSUMER_DASHBOARD, component: ConsumerDashboardComponent, canActivate: [AuthGuard] },
    { path: MAIN_CONSTANTS.LINK.CLIENT_DASHBOARD, component: ClientDashboardComponent, canActivate: [AuthGuard] },
    { path: MAIN_CONSTANTS.LINK.CONSUMER_DASHBOARD, component: ConsumerDashboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
imports: [RouterModule.forChild(mainRoutes)],
exports: [RouterModule]
})
export class MainRoutingModule {}
