import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { BOARD_MANUFACTURER_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { NewProductListComponent } from './views/new-product-list/new-product-list.component';
import { BoardProductTypeComponent } from './views/board-productType/board-productType.component';
import { BoardProductTypeShowComponent } from './views/board-productType-show/board-productType-show.component';
import { BoardListComponent } from '../board/views/board-list/board-list.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ListBoardComponent } from './views/list-board/list-board.component';

const boardManufacturerRoutes: Routes = [
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.BOARD_PRODUCT_TYPE, component: BoardProductTypeComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.NEW_PRODUCT_LIST, component: NewProductListComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.BOARD_PRODUCT_TYPE_SHOW, component: BoardProductTypeShowComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.PRODUCT_TYPE_BOARD, component: BoardListComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.CHANGE_PASSWORD, component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: BOARD_MANUFACTURER_CONSTANTS.LINK.LIST_BOARD, component: ListBoardComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(boardManufacturerRoutes)],
    exports: [RouterModule]
})

export class BoardManufacturerRoutingModule {}
