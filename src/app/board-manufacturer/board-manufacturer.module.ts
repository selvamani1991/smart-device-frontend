import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { BoardManufacturerService } from './services/board-manufacturer.service';
import { BoardProductService } from './services/board-product.service';
import { BoardManufacturerRoutingModule } from './board-manufacturer-routing.module';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProductListComponent } from './views/new-product-list/new-product-list.component';
import { ManufacturerProductTypeModalComponent } from './views/manufacturer-product-type-modal/manufacturer-product-type-modal.component';
import { BoardProductTypeComponent } from './views/board-productType/board-productType.component';
import { BoardProductTypeShowComponent } from './views/board-productType-show/board-productType-show.component';
import { BoardModule} from '../board/board.module';
import { ListBoardComponent } from './views/list-board/list-board.component';

@NgModule({
    declarations: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewProductListComponent,
        BoardProductTypeComponent,
        BoardProductTypeShowComponent,
        ManufacturerProductTypeModalComponent,
        ChangePasswordComponent,
        ListBoardComponent
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
        BoardManufacturerRoutingModule,
        BoardModule
    ],

    exports: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewProductListComponent,
        BoardProductTypeComponent,
        BoardProductTypeShowComponent,
        ManufacturerProductTypeModalComponent,
        ChangePasswordComponent,
        ListBoardComponent
    ],

    providers: [BoardManufacturerService, BoardProductService],
    bootstrap: [
        ListComponent,
        CreateComponent,
        EditComponent,
        ShowComponent,
        NewProductListComponent,
        BoardProductTypeComponent,
        BoardProductTypeShowComponent,
        ManufacturerProductTypeModalComponent,
        ChangePasswordComponent,
        ListBoardComponent
    ]
})
export class BoardManufacturerModule { }

