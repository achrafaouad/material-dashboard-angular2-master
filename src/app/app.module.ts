import { NgxCsvParser, NgxCsvParserModule } from 'ngx-csv-parser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { AgmCoreModule } from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FlatfileAdapterModule } from '@flatfile/angular';
import { LrsServiceService } from './lrs-service.service';
import { AgentProfilComponent } from './agent-profil/agent-profil.component';
import { AgentsComponent } from './agents/agents.component';
import { AgGridModule } from 'ag-grid-angular';
import { SynoptiqueComponent } from './synoptique/synoptique.component';
import { JwtClientService } from './jwt-client.service';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './notification.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        FormsModule,
        AppRoutingModule,
        NgxCsvParserModule,
        AgGridModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        }),
        ToastrModule.forRoot({
            timeOut:10000,
            positionClass:'toast-bottom-right'}),

       
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LandingPageComponent,
       
    
    ],
    providers: [LrsServiceService,JwtClientService,NotificationService],
    bootstrap: [AppComponent]
    
})
export class AppModule {
}
