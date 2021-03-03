import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TranslateModule}       from '@ngx-translate/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule }   from '../shared/shared.module';
import { TemplateModule} from '../template/template.module';
import { LayoutModule} from '../layout/layout.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './views/list/list.component';
import { ShowComponent } from './views/show/show.component';
import { CreateComponent } from './views/create/create.component';
import { EditComponent } from './views/edit/edit.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { UserFormModalComponent } from './views/user-form-modal/user-form-modal.component';
import { UserPasswordModalComponent } from './views/user-password-modal/user-password-modal.component';
import { ChangePasswordModalComponent } from './views/change-password-modal/change-password-modal.component';
import { UserService } from './services/user.service';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
    declarations: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        ChangePasswordComponent,
        UserFormModalComponent,
        UserPasswordModalComponent,
        ChangePasswordModalComponent

    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        SharedModule,
        TemplateModule,
        LayoutModule,
        PerfectScrollbarModule,
        NgbModule,
        UserRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        ChangePasswordComponent,
        UserFormModalComponent,
        UserPasswordModalComponent,
        ChangePasswordModalComponent
    ],
    providers: [UserService],
    bootstrap: [
        ListComponent,
        ShowComponent,
        CreateComponent,
        EditComponent,
        ChangePasswordComponent,
        UserFormModalComponent,
        UserPasswordModalComponent,
        ChangePasswordModalComponent
    ]
})
export class UserModule { }
