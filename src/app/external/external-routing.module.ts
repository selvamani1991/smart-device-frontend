import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './views/about/about.component';
import { ContactComponent } from './views/contact/contact.component';
import { PolicyComponent } from './views/policy/policy.component';
import { TermsComponent } from './views/terms/terms.component';

import { IslamComponent } from './views/islam/islam.component';
import { TauhidComponent } from './views/tauhid/tauhid.component';
import { NamaazComponent } from './views/namaaz/namaaz.component';
import { HajComponent } from './views/haj/haj.component';
import { JakaatComponent } from './views/jakaat/jakaat.component';
import { RozaComponent } from './views/roza/roza.component';
import { HadishComponent } from './views/hadish/hadish.component';


import { EXTERNAL_CONSTANTS } from './constants';


const mainRoutes: Routes = [
    { path: EXTERNAL_CONSTANTS.LINK.ABOUT, component: AboutComponent },
    { path: EXTERNAL_CONSTANTS.LINK.CONTACT, component: ContactComponent },
    { path: EXTERNAL_CONSTANTS.LINK.POLICY, component: PolicyComponent },
    { path: EXTERNAL_CONSTANTS.LINK.TERMS, component: TermsComponent },

    { path: EXTERNAL_CONSTANTS.LINK.ISLAM, component: IslamComponent },
    { path: EXTERNAL_CONSTANTS.LINK.TAUHID, component: TauhidComponent},
    { path: EXTERNAL_CONSTANTS.LINK.NAMAAZ, component: NamaazComponent},
    { path: EXTERNAL_CONSTANTS.LINK.HAJ, component: HajComponent},
    { path: EXTERNAL_CONSTANTS.LINK.JAKAAT, component: JakaatComponent},
    { path: EXTERNAL_CONSTANTS.LINK.ROZA, component: RozaComponent},
    { path: EXTERNAL_CONSTANTS.LINK.HADISH, component: HadishComponent}
];

@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class ExternalRoutingModule {}
