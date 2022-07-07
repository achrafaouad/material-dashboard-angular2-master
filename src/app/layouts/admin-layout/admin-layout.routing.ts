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

export const AdminLayoutRoutes: Routes = [
   

    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: AgentsComponent, children:[
        {path:'' , component:TypographyComponent},
        {path:':id' , component:AgentProfilComponent},
        {path:':id/edit' , component:AgentProfilEditComponent}
    ]},
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'synoptique',        component:  SynoptiqueComponent},
    { path: 'upgrade',        component: UpgradeComponent },
    
];
    