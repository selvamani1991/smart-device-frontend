import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelemetricComponent } from './views/telemetric/telemetric.component';
import { ErrorDataComponent } from './views/error-data/error-data.component';
import { TELEMETRIC_DATA_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const telemetricRoutes: Routes = [
    { path: TELEMETRIC_DATA_CONSTANTS.LINK.LIST, component: TelemetricComponent,canActivate: [AuthGuard] },
    { path: TELEMETRIC_DATA_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent,canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(telemetricRoutes)],
    exports: [RouterModule]
})
export class TelemetricDataRoutingModule {}
