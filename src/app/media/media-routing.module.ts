import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaListComponent } from './views/media-list/media-list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ShowFirmwareComponent } from './views/show-firmware/show-firmware.component';
import { FirmwareListComponent } from './views/firmware-list/firmware-list.component';
import { CreateFirmwareComponent } from './views/create-firmware/create-firmware.component';
import { MEDIA_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';

const mediaRoutes: Routes = [
    { path: MEDIA_CONSTANTS.LINK.MEDIA_LIST, component: MediaListComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.FIRMWARE_LIST, component: FirmwareListComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.CREATE_FIRMWARE, component: CreateFirmwareComponent, canActivate: [AuthGuard] },
    { path: MEDIA_CONSTANTS.LINK.SHOW_FIRMWARE, component: ShowFirmwareComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(mediaRoutes)],
    exports: [RouterModule]
})

export class MediaRoutingModule {}
