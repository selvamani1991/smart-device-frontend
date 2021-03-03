import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { TemplateModule} from '../../template/template.module';
import { LayoutModule} from '../../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ConsumerProductTypeService } from './services/consumer-product-type.service';
import { ConsumerProductTypeRoutingModule } from './consumer-product-type-routing.module';
import { ConsumerProductModule} from '../consumer-product/consumer-product.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent

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
        ConsumerProductTypeRoutingModule,
        ReactiveFormsModule,
        ConsumerProductModule

    ],
    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent

    ],
    providers: [ConsumerProductTypeService ],

    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent

    ]
})
export class ConsumerProductTypeModule { }
