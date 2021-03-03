import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RESOURCES_CONSTANTS } from './constants';
import { USER_CONSTANTS } from '../user/constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { MediaComponent } from './views/media/media.component';
import { FotaComponent } from './views/fota/fota.component';
import { TelemetricDataComponent } from './views/telemetric-data/telemetric-data.component';
import { ErrorDataComponent } from './views/error-data/error-data.component';
import { QrCodeComponent } from './views/qrcode/qrcode.component';

const resourcesRoutes: Routes = [
    { path: RESOURCES_CONSTANTS.LINK.MEDIA, component: MediaComponent,canActivate: [AuthGuard] },
    { path: RESOURCES_CONSTANTS.LINK.FOTA, component: FotaComponent,canActivate: [AuthGuard] },
    { path: RESOURCES_CONSTANTS.LINK.TELEMETRIC_DATA, component: TelemetricDataComponent,canActivate: [AuthGuard] },
    { path: RESOURCES_CONSTANTS.LINK.ERROR_DATA, component: ErrorDataComponent,canActivate: [AuthGuard] },
    { path: RESOURCES_CONSTANTS.LINK.QRCODE, component: QrCodeComponent,canActivate: [AuthGuard] },


]

@NgModule({
    imports: [RouterModule.forChild(resourcesRoutes)],
    exports: [RouterModule]
})
export class ResourcesRoutingModule {}