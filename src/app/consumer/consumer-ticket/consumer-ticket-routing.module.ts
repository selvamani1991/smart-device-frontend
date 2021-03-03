import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllListComponent } from './views/all-list/all-list.component';
import { ListComponent } from './views/list/list.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ShowComponent } from './views/show/show.component';
import { CONSUMER_TICKET_CONSTANTS } from './constants';
import { AuthGuard } from '../../auth/services/auth.guard';

const consumerTicketRoutes: Routes = [
    { path: CONSUMER_TICKET_CONSTANTS.LINK.ALL_LIST, component: AllListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_TICKET_CONSTANTS.LINK.LIST, component: ListComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_TICKET_CONSTANTS.LINK.CREATE, component: CreateComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_TICKET_CONSTANTS.LINK.EDIT, component: EditComponent, canActivate: [AuthGuard] },
    { path: CONSUMER_TICKET_CONSTANTS.LINK.SHOW, component: ShowComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(consumerTicketRoutes)],
    exports: [RouterModule]
})

export class ConsumerTicketRoutingModule { }
