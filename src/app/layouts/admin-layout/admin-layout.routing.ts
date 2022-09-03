import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AgentProfilComponent } from '../../agent-profil/agent-profil.component';
import { AgentsComponent } from '../../agents/agents.component';
import { SynoptiqueComponent } from 'app/synoptique/synoptique.component';
import { AgentProfilEditComponent } from 'app/agent-profil-edit/agent-profil-edit.component';
import { TableListComponentPonctuel } from 'app/table-list-ponctuel/table-list-ponctuel.component';
import { SynoptiqueAnalyseComponent } from 'app/synoptiqueAnalyse/synoptique_analyse.component';
import { SynoptiqueMultiComponent } from 'app/synoptiqueMultiRessource/synoptique_multi.component';
import {ProfileComponent } from 'app/profile/profile.component';
import { NewProfile } from 'app/createProfile/NewProfile.component';
import { ProfilProfilComponent } from 'app/profileProfil/agent-profil.component';
export const AdminLayoutRoutes: Routes = [
   

    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'table-list-ponctuel',     component: TableListComponentPonctuel },
    { path: 'typography',     component: AgentsComponent, children:[
        {path:'' , component:TypographyComponent},
        {path:':id' , component:AgentProfilComponent},
        {path:':id/edit' , component:AgentProfilEditComponent}
    ]},
    { path: 'profile',     component: AgentsComponent, children:[
        {path:'' , component:ProfileComponent},
        {path:':id' , component:ProfilProfilComponent},
        {path:':id/edit' , component:AgentProfilEditComponent}
    ]},
    { path: 'icons',          component: IconsComponent },
    { path: 'addprofile',          component: NewProfile },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'synoptique',        component:  SynoptiqueComponent},
    { path: 'synoptiqueAnalyseComponent',        component:  SynoptiqueAnalyseComponent},
    { path: 'synoptiqueMultiComponent',        component:  SynoptiqueMultiComponent},
    { path: 'upgrade',        component: UpgradeComponent },
    
];
    