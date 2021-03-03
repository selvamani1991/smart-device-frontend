import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MediaComponent } from './views/media/media.component';
import { FotaComponent } from './views/fota/fota.component';
import { TelemetricDataComponent } from './views/telemetric-data/telemetric-data.component';
import { ErrorDataComponent } from './views/error-data/error-data.component';
import { QrCodeComponent } from './views/qrcode/qrcode.component';
import { ResourcesService } from './services/resources.service';
import { ResourcesRoutingModule } from './resources-routing.module';
import { CityModule} from '../city/city.module';
import { MachineModule} from '../machine/machine.module';
import { ProductModule} from '../product/product.module';


@NgModule({
    declarations: [
        MediaComponent,
        FotaComponent,
        TelemetricDataComponent,
        ErrorDataComponent,
        QrCodeComponent

    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        PerfectScrollbarModule,
        ResourcesRoutingModule,
        CityModule,
        MachineModule,
        ProductModule
    ],

    exports: [
        MediaComponent,
        FotaComponent,
        TelemetricDataComponent,
        ErrorDataComponent,
        QrCodeComponent

    ],

    providers: [ResourcesService],
    bootstrap: [
        MediaComponent,
        FotaComponent,
        TelemetricDataComponent,
        ErrorDataComponent,
        QrCodeComponent

    ]
})
export class ResourcesModule { }