import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { PRODUCT_TYPE_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { ProductTypeBoardComponent } from './views/product-type-board/product-type-board.component';
import { ProductListComponent } from '../product/views/product-list/product-list.component';
import { MediaListComponent } from '../media/views/media-list/media-list.component';
import { FirmwareListComponent } from '../media/views/firmware-list/firmware-list.component';
import { ProductTypeMachineComponent } from './views/product-type-machine/product-type-machine.component';
import { BoardsComponent } from './views/boards/boards.component';
import { MachinesComponent } from './views/machines/machines.component';

const productTypeRoutes: Routes = [
    { path: PRODUCT_TYPE_CONSTANTS.LINK.LIST, component: ListComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.CREATE, component: CreateComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.EDIT, component: EditComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.SHOW, component: ShowComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.PRODUCT_TYPE_BOARD, component: ProductTypeBoardComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.PRODUCT_LIST, component: ProductListComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.MEDIA_LIST, component: MediaListComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.PRODUCT_TYPE_MACHINE, component: ProductTypeMachineComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.BOARDS, component: BoardsComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.MACHINES, component: MachinesComponent,canActivate: [AuthGuard] },
    { path: PRODUCT_TYPE_CONSTANTS.LINK.FIRMWARE_LIST, component: FirmwareListComponent,canActivate: [AuthGuard] }

]

@NgModule({
    imports: [RouterModule.forChild(productTypeRoutes)],
    exports: [RouterModule]
})
export class ProductTypeRoutingModule {}
