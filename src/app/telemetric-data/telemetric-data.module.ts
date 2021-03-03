import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TranslateModule}       from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TelemetricComponent } from './views/telemetric/telemetric.component';
import { ErrorDataComponent } from './views/error-data/error-data.component';
import { TelemetricDataService } from './services/telemetric-data.service';
import { ErrorDataService } from './services/error-data.service';
import { TelemetricDataRoutingModule }   from './telemetric-data-routing.module';

@NgModule({
    declarations: [
        TelemetricComponent,
        ErrorDataComponent
    ],

    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        NgbModule,
        LayoutModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        TelemetricDataRoutingModule,
    ],

    exports: [
        TelemetricComponent,
        ErrorDataComponent
    ],

    providers: [TelemetricDataService,ErrorDataService],
    bootstrap: [
        TelemetricComponent,
        ErrorDataComponent
    ]
})
export class TelemetricDataModule { }
