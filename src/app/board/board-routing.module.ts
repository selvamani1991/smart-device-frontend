import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardListComponent } from './views/board-list/board-list.component';
import { CreateComponent } from './views/create/create.component';
import { BOARD_CONSTANTS } from './constants';
import { AuthGuard } from '../auth/services/auth.guard';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';

const boardRoutes: Routes = [
    { path: BOARD_CONSTANTS.LINK.BOARD_LIST, component: BoardListComponent, canActivate: [AuthGuard] },
    { path: BOARD_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: BOARD_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: BOARD_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(boardRoutes)],
    exports: [RouterModule]
})

export class BoardRoutingModule {}
