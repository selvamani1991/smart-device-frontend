import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MediaListComponent } from './views/media-list/media-list.component';
import { FirmwareListComponent } from './views/firmware-list/firmware-list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ShowFirmwareComponent } from './views/show-firmware/show-firmware.component';
import { CreateFirmwareComponent } from './views/create-firmware/create-firmware.component';
import { MediaService } from './services/media.service';
import { MediaRoutingModule } from './media-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MediaListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        FirmwareListComponent,
        CreateFirmwareComponent,
        ShowFirmwareComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        PerfectScrollbarModule,
        MediaRoutingModule,
        ReactiveFormsModule
    ],

    exports: [
        MediaListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        FirmwareListComponent,
        CreateFirmwareComponent,
        ShowFirmwareComponent
    ],

    providers: [MediaService ],

    bootstrap: [
        MediaListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        FirmwareListComponent,
        CreateFirmwareComponent,
        ShowFirmwareComponent
    ]
})
export class MediaModule { }

